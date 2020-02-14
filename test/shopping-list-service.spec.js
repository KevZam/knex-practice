const shopping_list_service = require("../src/shopping-list-service.js");
const knex = require("knex");

describe("service item obj", () => {
  let db;
  let testData = [
    {
      id: 1,
      name: 'one',
      date_added: new Date('2020-02-13T16:28:32.615z'),
      price: ('21.00'),
      category: 'Snack'
    },

    {
      id: 2,
      name: 'two',
      date_added: new Date('2020-02-14T16:28:32.615z'),
      price: ('25.00'),
      category: 'Main'
    },

    {
      id: 3,
      name: 'three',
      date_added: new Date('2020-02-15T16:28:32.615z'),
      price: ('28.00'),
      category: 'Lunch'
    },
  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })

  before(() => db('shopping_list').truncate())

  afterEach(() => db('shopping_list').truncate())

  after(() => db.destroy())

  context(`Given 'shopping_list' has data`, () => {
    before(() => {
      return db
        .into('shopping_list')
        .insert(testData)
    })

    it("get all items should get all items", () => {
      const expectedItems = testData.map(item => ({
        ...item,
        checked: false,
      }))
      return shopping_list_service.getAllItems(db)
        .then(results => {
          expect(results).to.eql(expectedItems)
        })
    })

    it("get by id should return 1 item", () => {
      const id = 2;
      const expectedResult = testData[id - 1]
      return shopping_list_service.getById(db, id)
        .then(results => {
          expect(results).to.eql({
            id: id,
            name: expectedResult.name,
            date_added: expectedResult.date_added,
            price: expectedResult.price,
            category: expectedResult.category,
            checked: false
          })
        })
    })

    it(`delete Item removes an item by id from 'shopping_list' table`, () => {
      const id = 3
      return ShoppingListService.deleteItem(db, id)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          const expected = testData
            .filter(item => item.id !== id)
            .map(item => ({
              ...item,
              checked: false,
            }))
          expect(allItems).to.eql(expected)
        })
    })

    it(`update Item updates an item from the 'shopping_list' table`, () => {
      const id = 3
      const newData = {
        name: 'updated title',
        price: '19.99',
        date_added: new Date(),
        checked: true,
      }
      const originalItem = testData[id - 1]
      return ShoppingListService.updateItem(db, id, newData)
        .then(() => ShoppingListService.getById(db, id))
        .then(item => {
          expect(item).to.eql({
            id: id,
            ...originalItem,
            ...newData,
          })
        })
    })
  })

  context(`Given 'shopping_list' has no data`, () => {
    it(`get All Items resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db)
        .then(results => {
          expect(results).to.eql([])
        })
    })

    it(`insert Item inserts an article and resolves the article with an 'id'`, () => {
      const newItem = {
        name: 'Test name',
        price: '5.05',
        date_added: new Date('2020-01-01T00:00:00.000Z'),
        checked: true,
        category: 'Lunch',
      }
      return ShoppingListService.createItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            name: newItem.name,
            price: newItem.price,
            date_added: newItem.date_added,
            checked: newItem.checked,
            category: newItem.category,
          })
        })
    })
  })
})