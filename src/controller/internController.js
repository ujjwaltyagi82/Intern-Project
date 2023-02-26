const InternModel = require('../models/internModel')
const CollegeModel = require('../models/collegeModel')

//*******************VALIDATIONS*********************/

const isValid = function(value){
if(typeof (value) === 'undefined' || value === null) return false
if(typeof (value) === 'string' && value.trim().length == 0) return false
    return true
}

const isValidRequestBody = function(reqBody){
    return Object.keys(reqBody).length > 0
}

//****************** CREATE INTERNS********************/

const createIntern = async function(req,res){
    try{

        const requestBody = req.body

        if(!isValidRequestBody(requestBody)){
            return res
                .status(400)
                .send({status: false , message: "Please Provide input data"});
        }

        const {name, email, mobile , collegeName} = requestBody

        if(!isValid(name)){
            return res
                .status(400)
                .send({status:false , message: "Name must be provided"});
        }

        if(!isValid(email)){
            return res
                .status(400)
                .send({status:false , message: "email must be Provided"});
        }

        if(! /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            return res
                .status(400)
                .send({status:false, message: "enter a valid email"});
        }

        if(!isValid(mobile)){
            return res
                .status(400)
                .send({status: false, message: "mobile must be provided"})
        }

        if(! /^[6-9]\d{9}$/.test(mobile)){
            return res
                .status(400)
                .send({status: false , message: "enter a valid mobileNumber"})
        }

        if(!isValid(collegeName)){
            return res
                .status(400)
                .send({status: false, message: "college name must be provided"})
        }

        const isEmailNotUnique = await InternModel.findOne({email: email})

        if(isEmailNotUnique){
            return res
                .status(400)
                .send({status:false , message: "email already exits"})
        }

        const isMobileNumberNotUnique = await InternModel.findOne({mobile : mobile})

        if(isMobileNumberNotUnique){
            return res
                .status(400)
                .send({status: false, message:"mobile number already exits"})
        }

        const collegeByCollegeName = await CollegeModel.findOne({name : collegeName})

        if(!collegeByCollegeName){
            return res
                .status(400)
                .send({status:false , message: `no college found by this name: ${collegeName}`})
        }

        const collegeId = collegeByCollegeName._id

        requestBody.collegeId = collegeId

        delete requestBody.collegeName

        const newIntern = await InternModel.create(requestBody)

        res
        .status(201)
        .send({status: true , message: "new intern entry done", data: newIntern})

    }catch(error){

        res
        .status(500)
        .send({error: error.message})

    }
}

module.exports.createIntern = createIntern

