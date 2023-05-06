import app from "../config";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore(app);

const addData = async (collection: string, id: string, data: any) => {
    let result = null;
    let error = null;

    try {
        result = await setDoc(doc(db, collection, id), data, {
            merge: true,
        });
    } catch (e) {
        console.log(e)
        error = e;
    }

    return { result, error };
};

export default addData;
