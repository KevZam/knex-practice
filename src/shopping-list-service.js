const shopping_list_services = {
    getAllItems(knex) {
        return knex
        .select("*")
        .from("shopping_list")
    },

    getById(knex, id){
        return knex
        .from("shopping_list")
        .select(`*`)
        .where (`id`, id)
        .first()
    },

    createItem(knex, item){
         return knex("shopping_list")
        .returning(item)
        .insert(item)
    },

    updateItem(knex, item, id){
        return knex("shopping_list")
        .where("id", id)
        .update(item)
    },

    deleteItem(knex, id) {
        return knex("shopping_list")
        .where("id", id)
        .del()
    }
};

module.exports = shopping_list_services;