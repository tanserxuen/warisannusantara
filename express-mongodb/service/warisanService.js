const { WarisanNusantara } = require('../schema/warisannusantara');
const { Storage } = require('@google-cloud/storage');

async function getAllWarisanNusantara() {
    try{
        var result = await WarisanNusantara.find({});
        return result;
    }catch(error){
        console.error("Error retrieving warisan nusantara: ", error);
    }
}

async function getWarisanNusantarByCategory(category) {
    try{
        var result = await WarisanNusantara.find({category: category});
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

// async function deleteWarisanNusantara(id) {
//     try {
//         var result = await WarisanNusantara.findByIdAndDelete(id);
//         // var result = await WarisanNusantara.deleteOne({id});
//         return result;
//     } catch (error) {
//         console.error("Error deleting warisan nusantara: ", error);
//     }
// }

// Delete the waste by ID function
async function deleteWarisanNusantara(id) {
    try {
        // const waste = await Waste.findById(id);
        var result = await WarisanNusantara.findById(id);

        if (result) {
            // const imagePath = waste.image;
            const imagePath = result.picture;
            // Initialize the Google Cloud Storage client
            const storage = new Storage({
                projectId: 'wt-programming',
                keyFilename: 'wt-programming-c1b7d8b75884.json'
            });

            // Get the Google Cloud Storage bucket reference
            const bucketName = 'warisan';
            const bucket = storage.bucket(bucketName);


            // Delete the file from Google Cloud Storage
            const gcsFileName = imagePath.replace('https://storage.googleapis.com/warisan/', '');
            const gcsFile = bucket.file(gcsFileName);

            await gcsFile.delete();

            // Delete the waste document from the database
            await WarisanNusantara.deleteOne({ _id: id });

            return 'Delete collection successfully';
        } else {
            return 'Collection not found';
        }
    } catch (err) {
        throw err;
    }
}

module.exports = { 
    getAllWarisanNusantara,
    getWarisanNusantaraById,
    addWarisanNusantara,
    editWarisanNusantara,
    deleteWarisanNusantara, 
}