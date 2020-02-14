const shopping_list_service = require("../src/shopping-list-service.js");
const knex = require("knex"); 

describe("service item obj", () => {
    let db; 
    let testData = [
        {id:1,
        name:'one',
        date_added:new Date('2020-02-13T16:28:32.615z'),
        price:('21.00'),
        category:'Snack'},

        {id:2,
        name:'two',
        date_added:new Date('2020-02-14T16:28:32.615z'),
        price:('25.00'),
        category:'Main'},
        
        {id:3,
        name:'three',
        date_added:new Date('2020-02-15T16:28:32.615z'),
        price:('28.00'),
        category:'Lunch'},
    ]

    before(() => { db = knex({ 
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

        it("")
    })
})