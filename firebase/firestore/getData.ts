import { db } from "../config";
import { doc, getDoc } from "firebase/firestore";

const getData = async (collection: string, id: string) => {
    let docRef = doc(db, collection, id);

    let result = null;
    let error = null;

    try {
        result = await getDoc(docRef);

        if (result.exists()) {
            result = result.data();
        }
    } catch (e) {
        console.log(e);
        error = e;
    }

    return { result, error };
};

export default getData;
