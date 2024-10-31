let express = require('express');
let router = express.Router();
const db = require("./../db");


/**
 * GET /registered_students
 *
 * @return a list of registered students (extracted from a join between
 * registered_students, students and classes tables in the database) as JSON
 */
router.get("/registered_students", async function (req, res)
{
    try
    {
        const listOfRegisteredStudentJoinResults = await db.getAllRegisteredStudents();
        console.log({listOfRegisteredStudentJoinResults});

        res.send(listOfRegisteredStudentJoinResults);
    }
    catch (err)
    {
        console.error("Error:", err.message);
        res.status(500).json({"error": "Internal Server Error"});
    }
});


/**
 * POST /add_student_to_class
 * with the following form parameters:
 *      studentId
 *      classId
 *
 * The parameters passed in the body of the POST request will be inserted
 * into the registered_students table in the database.
 */
router.post("/add_student_to_class", async function (req, res)
{
    try {
        const student_id = req.body.studentID;
        const class_id = req.body.classID;

        console.log("student_id:", student_id);
        console.log("class_id:", class_id);

        if (student_id === undefined) {
            // console.log("parameter studentId is required.");
            res.status(400).json({"error": "studentID parameter is required."});
            return;
        }
        if (class_id === undefined) {
            res.status(400).json({"error": "classID parameter is required."});
            return;
        }
        let studentRegisteredToClass = {
            studentID: student_id,
            classID: class_id
        };
        studentRegisteredToClass = await db.addStudentToClass(student_id, class_id);
        console.log("studentRegisteredToClass:", studentRegisteredToClass);
        res.status(201).json(studentRegisteredToClass);

    }
    catch (err) {
        console.error("Error:", err.message);
        res.status(422).json({"error": "Failed to register the student to the class "});
    }
});


/**
 * DELETE /drop_student_from_class
 * with the following form parameters:
 *      studentId
 *      classId
 *
 * Deletes the student with id = {studentId} from the class with id = {classId}
 * from the registered_students in the database.
 *
 * @throws a 404 status code if the student with id = {studentId} does not exist
 * @throws a 404 status code if the class with id = {classId} does not exist
 */
router.delete("/drop_student_from_class", async function (req, res)
{
    try {
        const student_id = req.body.studentID;
        const class_id = req.body.classID;

        // const studentToDrop = await db.dropAnExistingStudentFromAClass(student_id, class_id);
        const studentToDrop = await db.getStudentWithId(student_id);
        const classToDropFrom = await db.getClassWithId(class_id);


        if (classToDropFrom === null) {
            console.log(`could not find class with id ${class_id} from the database because it does not exist`);
            res.status(404).json({"error": "could not find the class."});
            return;
        }
        if (studentToDrop === null) {
            console.log(`Could not find student with id ${student_id} from the database because it does not exist`);
            res.status(404).json({"error": "could not find student in db."});


        }
        console.log(`Attempting to drop student ${student_id} from class ${class_id}`);

        await db.dropAnExistingStudentFromAClass(student_id, class_id);

        res.status(204).send();


    }
    catch (err) {
        console.error("Error:", err.message);
        res.status(422).json({"error": "Failed to drop the student from the class."});
    }
});


/**
 * GET /students_taking_class/{classCode}
 *
 * @return a list of registered students (extracted from a join between
 * registered_students, students and classes tables in the database) as JSON
 * that are taking the class {classCode}
 */
// TODO: implement this route


/**
 * GET /classes_in_which_student_is_enrolled/{studentId}
 *
 * @return a list of all classes (extracted from a join between
 * registered_students, students and classes tables in the database) as JSON
 * in which the student with id = {studentId} is enrolled
 *
 * @throws a 404 status code if the student with id = {studentId} does not exist
 */
// TODO: implement this route


module.exports = router;
