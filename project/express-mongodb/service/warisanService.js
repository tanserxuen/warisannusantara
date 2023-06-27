const { WarisanNusantara } = require('../schema/warisannusantara');

async function getAllWarisanNusantara() {
    try{
        var result = await WarisanNusantara.find({});
        return result;
    }catch(error){
        console.error("Error retrieving warisan nusantara: ", error);
    }
}

async function getWarisanNusantaraById(id) {
    try {
        var result = await WarisanNusantara.findOne({_id: id});
        if(result) return result;
        else throw new Error("Warisan Nusantara not found");
    } catch (error) {
        console.error("Error retrieving warisan nusantara by id: ", error);
    }
}

async function addWarisanNusantara(category, name, description, date, picture) {
    try {
        var newWarisanNusantara = new WarisanNusantara({category, name, description, date, picture});
        var result = await newWarisanNusantara.save();
        return result;
    } catch (error) {
        console.error("Error adding warisan nusantara: ", error);
    }
}

async function editWarisanNusantara(id, category, name, description, date, picture) {
    try {
        const warisan = await WarisanNusantara.findById(id); 
        if(!warisan) throw new Error("Warisan Nusantara not found");

        warisan.category = category;
        warisan.name = name;
        warisan.description = description;
        warisan.date = date;
        warisan.picture = picture;

        var result = await warisan.save();
        return result;
    } catch (error) {
        console.error("Error editing warisan nusantara: ", error);
    }
}

async function deleteWarisanNusantara(id) {
    try {
        var result = await WarisanNusantara.findByIdAndDelete(id);
        // var result = await WarisanNusantara.deleteOne({id});
        return result;
    } catch (error) {
        console.error("Error deleting warisan nusantara: ", error);
    }
}

module.exports = { 
    getAllWarisanNusantara,
    getWarisanNusantaraById,
    addWarisanNusantara,
    editWarisanNusantara,
    deleteWarisanNusantara, 
}