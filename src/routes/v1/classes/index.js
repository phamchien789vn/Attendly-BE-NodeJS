import express from 'express';
import { createClass, getStudentsInClass, getTeacherClasses, getClassSessions } from '../../../controllers/class.controller.js';
import validate from '../../../middlewares/validate.js'
import { createClassSchema } from '../../../validations/class.validation.js';
import { markAttendance, getAttendanceList } from '../../../controllers/attendance.controller.js';
import { API_ROUTER_CONSTANTS } from '../../../utils/constants/apiRoutes.constants.js'
import { attendanceSchema } from '../../../validations/attendance.validation.js';
import { createSession } from '../../../controllers/session.controller.js';
import { authenticateToken, authorize, authorizeClass } from '../../../middlewares/auth.middleware.js';

const router = express.Router();

router.post(API_ROUTER_CONSTANTS.API_ATTENDANCE,
    authenticateToken,
    authorize('student'),
    validate(attendanceSchema),
    markAttendance
);

router.post('/',
    authenticateToken,
    authorize('teacher'),
    validate(createClassSchema),
    createClass
);

router.get('/',
    authenticateToken,
    authorize('teacher'),
    getTeacherClasses
);

router.get('/:classId/students',
    authenticateToken,
    authorize('teacher'),
    getStudentsInClass
);

router.post(
    `/:classId${API_ROUTER_CONSTANTS.API_SESSIONS}`,
    authenticateToken,
    authorize('teacher'),
    authorizeClass,
    createSession
);

router.get(
    `/:classId${API_ROUTER_CONSTANTS.API_SESSIONS}/:sessionId`,
    authenticateToken,
    authorizeClass,
    getAttendanceList
);

router.get('/:classId/sessions',
    authenticateToken,
    authorizeClass,
    getClassSessions
);

export default router;
