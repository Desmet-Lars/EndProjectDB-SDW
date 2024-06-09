import { db } from '../../lib/FirebaseConfig'; // Adjust the import path based on your project structure

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const formData = req.body;

        try {
            const batch = db.batch();
            formData.forEach(data => {
                const docRef = db.collection('Codes').doc();
                batch.set(docRef, data);
            });
            await batch.commit();
            res.status(200).json({ message: 'Data added successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
