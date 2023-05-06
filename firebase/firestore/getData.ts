import app from "../config";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore(app);

const getData = async (collection: string, id: string) => {
    let docRef = doc(db, collection, id);

    let result = null;
    let error = null;

    try {
        result = await getDoc(docRef);
    } catch (e) {
        console.log(e)
        error = e;
    }

    return { result, error };
};

export default getData;
