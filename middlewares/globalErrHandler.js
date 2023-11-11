export const globalErrhandler = (err,req,res,next) => {
    //stack
    //message

    const stack = err?.stack;
    const message = err?.message;
    res.json({
        stack,
        message
    })
}