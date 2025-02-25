const { upload, uploadMultiple } = require("../middleware/multer");
const {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} = require("firebase/storage");
const {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} = require("firebase/auth");
const { auth } = require("../config/firebase.config");

async function uploadImage(file, quantity) {
    const storageFB = getStorage();
    await signInWithEmailAndPassword(
        auth,
        process.env.FIREBASE_USER,
        process.env.FIREBASE_AUTH
    );
    if (quantity === "single") {
        const dateTime = Date.now();
        const fileName = `${dateTime}`;
        const storageRef = ref(storageFB, fileName);
        const metadata = { contentType: file.type };

        await uploadBytesResumable(storageRef, file.buffer, metadata);
        const url = await getDownloadURL(storageRef);
        return url;
    }
    if (quantity === "multiple") {
        for (let i = 0; i < file.images.length; i++) {
            const dateTime = Date.now();
            const fileName = `${dateTime}`;
            const storageRef = ref(storageFB, fileName);
            const metadata = {
                contentType: file.images[i].mimetype,
            };
            const saveImage = await Image.create({ imageUrl: fileName });
            file.item.imageId.push({ _id: saveImage._id });
            await file.item.save();
            await uploadBytesResumable(
                storageRef,
                file.images[i].buffer,
                metadata
            );
        }
        return;
    }
}

const addImage = async (req, res, next) => {
    if (req && req.file === undefined) {
        return res.status(500).json({ error: "file not found" });
    }

    const file = {
        type: req.file.mimetype,
        buffer: req.file.buffer,
    };
    try {
        const buildImage = await uploadImage(file, "single");
        return res
            .status(201)
            .json({
                success: "Image added successfully",
                imageName: buildImage,
            });
    } catch (err) {
        next(err);
    }
};

module.exports = { addImage };
