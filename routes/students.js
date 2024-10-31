let express = require('express');
let router = express.Router();
const db = require("./../db");


/**
 * GET /students
 *
 * @return a list of students (extracted from the students table in the database) as JSON
 */
router.get("/students", async function (req, res)
{
    try {
        const listOfStudents = await db.getAllStudents();
        console.log("listOfStudents:", listOfStudents);
    }
    catch (err)
    {
        console.error("Error:", err.message);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});


/**
 * GET /students/{id}
 *
 * @return the student with id = {id} (extracted from the students table in the database) as JSON
 *
 * @throws a 404 status code if the student with id = {id} does not exist
 */
router.get("/students/:id", async function (req, res)
{
    try {
        const id = req.params.id;
        console.log("id =  " + id);
        const studentWithID = await db.getStudentWithId(id);
        console.log("studentWithID:", studentWithID);
        if (studentWithID == null)
        {
            console.log("No student with id " + id + " exists.");

            res.status(404).json({"error" : "student with id " + id + " from the database because it does not exist"});
        }
        res.send(studentWithID);
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ "error": "Internal Server Error" });
    }
});


/**
 * POST /students
 * with the following form parameters:
 *      firstName
 *      lastName
 *      birthDate (in ISO format: yyyy-mm-dd)
 *
 * The parameters passed in the body of the POST request are used to create a new student.
 * The new student is inserted into the students table in the database.
 *
 * @return the created student (which was inserted into the database), as JSON
 */
router.post("/students", async function (req, res)
{
    // TODO: implement this route
    try
    {

        const first_name = req.body.firstName;
        const last_name = req.body.lastName;
        const birth_date = req.body.birthDate;

        console.log("first_name:", first_name);
        console.log("last_name:", last_name);
        console.log("birth_date:", birth_date);

        if (first_name === undefined)
        {
            res.status(400).json({"error": "parameter firstName is required"});
            return;
        }
        if (last_name === undefined)
        {
            res.status(400).json({"error": "parameter lastName is required"});
            return;
        }
        if (birth_date === undefined)
        {
            res.status(400).json({"error": "parameter birthDate is required"});
            return;
        }
        let createdStudent = {
            id: null,
            firstName: first_name,
            lastName: last_name,
            birthDate: birth_date
        };
        createdStudent = await db.addNewStudent(createdStudent);
        console.log("createdStudent:", createdStudent);
        res.status(201.).json(createdStudent);
    }
    catch (err)
    {
        console.error("Error:", err.message);
        res.status(422).json({ "error": "Failed to add student to the database" });
    }
});


/**
 * PUT /students/{id}
 * with the following form parameters:
 *      firstName
 *      lastName
 *      birthDate
 *
 * The parameters passed in the body of the PUT request are used to
 * update the existing student with id = {id} in the students table in the database.
 *
 * @return the updated student as JSON
 *
 * @throws a 404 status code if the student with id = {id} does not exist
 */
router.put("/students/:id", async function (req, res)
{
    // TODO: implement this route or the PATCH route below
});


/**
 * PATCH /students/{id}
 * with the following optional form parameters:
 *      firstName
 *      lastName
 *      birthDate
 *
 * The optional parameters passed in the body of the PATCH request are used to
 * update the existing student with id = {id} in the students table in the database.
 *
 * @return the updated student as JSON
 *
 * @throws a 404 status code if the student with id = {id} does not exist
 */
router.patch("/students/:id", async function (req, res)
{
    try {
        const id = req.params.id;
       const first_name = req.body.firstName || null;
       const last_name = req.body.lastName || null;
       const birth_date = req.body.birthDate || null;

       console.log("first_name:", first_name);
       console.log("last_name:", last_name);
       console.log("birth_date:", birth_date);

       let studentToUpdate = await db.getStudentWithId(id);
       console.log({studentToUpdate});

       if (studentToUpdate == null) {
           console.log("No student with id " + id + " exists.");

           res.status(404).json({"error": "failed to update student with id " + id + " from the database because it does not exist"});
           return;
       }
       if (first_name !=null) {
           studentToUpdate.firstName = first_name;
       }
       if (last_name !=null) {
           studentToUpdate.lastName = last_name;
       }
       if (birth_date !=null) {
           studentToUpdate.birthDate = birth_date;
       }
       await db.updateExistingStudentInformation(studentToUpdate);
       res.json(studentToUpdate);
    } catch (err) {
        console.error("Error:", err.message);
        res.status(422).json({ "error": "Failed to update the student with id = " + req.params.id + " in the database." });
    }
});


/**
 * DELETE /students/{id}
 *
 * Deletes the student with id = {id} from the students table in the database.
 *
 * @throws a 404 status code if the student with id = {id} does not exist
 */
router.delete("/students/:id", async function (req, res)
{
    // TODO: implement this route
});


module.exports = router;
