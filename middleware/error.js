const AppError = require("./../utils/AppError");

//Duplicate value in MongoDB

const handleDuplicateError = (err)=>{
    const dupKey = Objects.keys(err.keyValue)[0];
    const dupValue = Objects.values(err.keyValue)[0];
    console.log(dupKey,dupValue);
    const message = `Duplicate ${dupKey}: "${dupValue}". exist already`;
    return new AppError(message,400);
};

//Cast Id error

const handleCastError = (err)=>{
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message,400);
};

//Validation error

const handleValidationError = (err)=>{
    const errors = Object.values(err.errors).map(el=>el.message);
    const message = `Invalid Input Data: ${errors.join(". ")}`;
    return new AppError(message,400);
};

//JWT error

const handleJWTError = ()=>{
    return new AppError("Invalid Token. Please login again",401);
};

const handleJWTExpiredError = ()=>{
    return new AppError("Your Token has expired. Please login again",401);
};

//Send error to client

const sendDevError =  async (err, res)=>{
    const statusCode  = err.statusCode || 500;
    res.status(statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
        err,
    });  
};

const prodDevError = async (err, res) => {
    if(!err.isOpertional) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        //Handle other errors not handle by the developer
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
        });
    }
};

const errorHandler = async (err, req, res, next) => {
    if(process.env.NODE_ENV === "development"){
        sendDevError(err, res);
    } else {
        let error = {...err};
        if(err.code === 11000) {
            error = handleDuplicateError(err);
        } else if (err.name === "CastError") {
            error = handleCastError(err);
        } else if (err.name === "ValidationError") {
            error = handleValidationError(err);
        }
        if (err.name === "JsonWebTokenError") {
            error = handleJWTError(err);
        }
        if (err.name === "TokenExpiredError") {
            error = handleJWTExpiredError(err);
        }
        prodDevError(error, res);
    }
    next();
};


module.exports = errorHandler;
