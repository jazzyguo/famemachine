import { db } from "../config";
import { doc, setDoc } from "firebase/firestore";

const addData = async (collection: string, id: string, data: any) => {
    let result = null;
    let error = null;

    try {
        result = await setDoc(doc(db, collection, id), data, {
            merge: true,
        });
    } catch (e) {
        console.log(e);
        error = e;
    }

    return { result, error };
};

export default addData;
