'use client'
import { db } from '../../../lib/FirebaseConfig'; // Adjust the import path based on your project structure

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { klas } = req.body;
        console.log("klas", klas)

        try {
            const userSnapshot = await db.collection('Students').where('Class', '==', klas).get();
            const users = userSnapshot.docs.map(doc => {
                const data = doc.data();
                return { name: data.Name, nr: data.Nr, klas: data.Class };
            });
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
