import {Router} from 'express'
import { createNotes, getAllNotes, searchNotes, updateUserNoteStyle } from '../controller/notes.controller.js';
import {authenticateUser} from '../middleware/auth.middleware.js'

const router = Router();

router.use(authenticateUser);

router.post("/create-notes" , createNotes);
router.get("/get-notes",getAllNotes );
router.get("/search",searchNotes );
router.patch("/notes/:noteId/style", updateUserNoteStyle);



export default router;