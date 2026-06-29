import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { upload } from '../middleware/upload.middleware';
import { upsertProfileSchema, interestsSchema, preferencesSchema } from '../validators';

const router = Router();

router.use(authenticate);

router.get('/me', profileController.getMine);
router.post('/', validate(upsertProfileSchema), profileController.upsert);
router.patch('/', validate(upsertProfileSchema), profileController.upsert);

router.post('/photos', upload.single('image'), profileController.addPhoto);
router.delete('/photos/:photoId', profileController.deletePhoto);

router.post('/interests', validate(interestsSchema), profileController.setInterests);
router.post('/preferences', validate(preferencesSchema), profileController.setPreferences);

export default router;
