import {Router} from 'express'
import { createNotes, getAllNotes, searchNotes, updateUserNoteStyle ,getNoteById ,deleteNote} from '../controller/notes.controller.js';
import {authenticateUser} from '../middleware/auth.middleware.js'


const router = Router();

router.use(authenticateUser);

router.post("/create-notes" , createNotes);
router.get("/get-notes",getAllNotes );
router.get("/notes/search",searchNotes );
router.get("/notes/:id",getNoteById );
router.delete("/notes/delete/:id",deleteNote );
router.patch("/notes/:noteId/style", updateUserNoteStyle);



export default router;