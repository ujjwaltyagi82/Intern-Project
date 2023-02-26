const CollegeModel = require('../models/collegeModel')
const InternModel = require('../models/internModel')
let axios = require("axios");

//****************Validation******************** ******/

const isValid = function (value) {
    if (typeof (value) === 'undefined' || value === null) return false
    if (typeof (value) === 'string' && value.trim().length == 0) return false
    return true
}

const isValidRequestBody = function (reqBody) {
    return Object.keys(reqBody).length > 0
}

const isValidObjectId = function (objectId) {
    return mongoose.Schema.Types.isValid(objectId)
}


//***************************CREATE COLLEGE**********************************/

const createCollege = async function (req, res) {
    try {

        const requestBody = req.body

        if (!isValidRequestBody(requestBody)) {
            return res
            .status(400)
            .send({ status: false, message: "please provide college data" })
        }

        const { name, fullName, logoLink } = requestBody

        if (!isValid(name)) {
            return res
                .status(400)
                .send({ status: false, message: "Name is required" })
        }

        if (!isValid(fullName)) {
            return res
                .status(400)
                .send({ status: false, message: "Full Name is required" })
        }

        if (!isValid(logoLink)) {
            return res
                .status(400)
                .send({ status: false, message: "LogoLink is required" })
        }

        const isNameNotUnique = await CollegeModel.findOne({ name: name })

        if (isNameNotUnique) {
            return res
                .status(409)
                .send({ status: false, message: "name already exits" })
        }

        const newCollegeEntry = await CollegeModel.create(requestBody)

        res
            .status(201)
            .send({ status: true, message: "new college entry done", data: newCollegeEntry })

    } catch (error) {

        res
            .status(500)
            .send({ error: error.message })

    }
}

//**************************GET COLLEGE DETAILS********************** */

const getCollegeDetails = async function (req, res) {
    try {

        const queryParams = req.query;
        const collegeName = queryParams.collegeName

        if (!isValidRequestBody(queryParams)) {
            return res
                .status(400)
                .send({ status: false, message: "please provide inputs for getting college details" });
        }

        if (!isValid(collegeName)) {
            return res
                .status(400)
                .send({ status: false, message: "please provide collegeName" })
        }

        const collegeByCollegeName = await CollegeModel.findOne({ name: collegeName })

        if (!collegeByCollegeName) {
            return res
                .status(404)
                .send({ status: false, message: "Invalid CollegeName" });
        }

        const collegeID = collegeByCollegeName._id

        const getInternsByCollegeID = await InternModel.find({ collegeId: collegeID }).select({_id:1 , email: 1,name: 1, mobile: 1})

        const { name, fullName, logoLink } = collegeByCollegeName

        const data = {
            name: name,
            fullName: fullName,
            logoLink: logoLink,
            interns: getInternsByCollegeID
        }

        res
            .status(200)
            .send({ status: true, data: data })

    } catch (error) {

        res
            .status(500)
            .send({ error: error.message })

    }
}


module.exports.createCollege = createCollege
module.exports.getCollegeDetails = getCollegeDetails