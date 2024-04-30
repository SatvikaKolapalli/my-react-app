const InventoryItem = require('../models/inventory');

const AWS = require('aws-sdk');

// Configure AWS to use your credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION // e.g., 'us-west-2'
});

// const s3 = new AWS.S3();

exports.addItem = async (req, res) => {
    const { name, quantity, imageUrl } = req.body;

    try {
        console.log("Adding Item");

        // New inventory item object
        const newItem = new InventoryItem({
            name,
            quantity,
            imageUrl
        });

        // Save the new item to the database
        const savedItem = await newItem.save();

        console.log("Item added successfully!");

        res.status(201).json({
            message: "Inventory item added successfully",
            status: true,
            item: savedItem
        });
    } catch (error) {
        console.log("Error while adding inventory: ", error);
        
        res.status(500).json({
            message: "Failed to add inventory",
            status: false
        });
    }
}

exports.getItem = async (req, res) => {
    const { _id } = req.query;

    // console.log("Req: ", req);

    try {
        console.log(`Fetching item with id ${_id}`);

        const item = await InventoryItem.findById(_id);

        if (!item) {
            console.log(`Item with id ${_id} not found`);

            return res.status(404).json({
                message: `Item with id ${_id} not found`,
                status: false
            });
        }

        // console.log(`Item fetched: `, item);
        console.log(`Item with id ${_id} fetched.`);

        res.status(200).json({
            message: `Item with id ${_id} fetched successfully`,
            status: true,
            item: item
        });
    } catch (error) {
        console.log(`Failed to get Item with id ${_id}. Error: `, error);

        res.status(500).json({
            message: `Failed to get Item with id ${_id}`,
            status: false
        })
    }
}

exports.getItems = async (req, res) => {
    try {
        console.log("Fetching inventory items!");

        const items = await InventoryItem.find();

        console.log("All items fetched!");

        res.status(200).json({
            message: "Inventory items fetched successfully",
            status: true,
            items: items
        });
    } catch (error) {
        console.log("Failed to get inventory items: ", error);

        res.status(500).json({
            message: "Failed to fetch items",
            status: false
        });
    }
}

exports.updateItem = async (req, res) => {
    const { _id, name, quantity, imageUrl } = req.body

    try {
        console.log(`Updating item with id ${_id}`);

        const updatedItem = await InventoryItem.findByIdAndUpdate(_id, {
            $set: {
                name: name,
                quantity: quantity,
                imageUrl: imageUrl
            }
        }, { new: true });  // Return the updated document

        if (!updatedItem) {
            return res.status(404).json({
                message: `Item with id ${_id} not found`,
                status: false
            });
        }

        console.log("Item updated successfuly: ", updatedItem);

        res.status(200).json({
            message: `Item with id ${_id} updated successfully`,
            status: true,
            item: updatedItem
        });
    } catch (error) {
        console.log(`Unable to update item with id ${_id}: `, error);

        res.status(500).json({
            message: `Unable to update item with id ${_id}`,
            status: false
        })
    }
}

exports.deleteItem = async (req, res) => {
    const { _id } = req.body;

    try {
        console.log(`Deleting item with id ${_id}`);
        
        const deletedItem = await InventoryItem.findOneAndDelete({ _id: _id });
        
        if (!deletedItem) {
            return res.status(404).json({
                message: `Item with id ${_id} not found`,
                status: false
            });
        }
        
        console.log(`Item with id ${_id} deleted successfully!`);
        
        res.status(200).json({
            message: `Item with id ${_id} deleted successfully`,
            status: true
        });
    } catch (error) {
        console.log(`Cannot delete item with id ${_id}: `, error);

        res.status(500).json({
            message: `Cannot delete item with id ${_id}`,
            status: false
        })
    }
}

exports.uploadImageToS3 = async (req, res) => {
    const file = req.file;
    const s3FileURL = process.env.AWS_UPLOADED_FILE_URL_LINK;

    try {
        let s3bucket = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        });
    
        var params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read' // Allows file to be publicly readable
        };
    
        s3bucket.upload(params, function(err, data) {
            if (err) {
                console.log('error in callback');
                console.log(err);
                return res.status(500).json({error: true, Message: err});
            }
            console.log('success');
            console.log(data);
            // Remove uploaded file from server since it's already in S3
            // fs.unlinkSync(file.path);
            res.send({data: {fileLink: `${s3FileURL}/${file.originalname}`}}); // Send back the URL to access the file on S3
        });
    } catch (error) {
        console.log("Failed to upload image to s3 bucket: ", error);

        res.status(500).json({
            message: "Failed to upload image to s3 bucket",
            status: false
        });
    }
}
