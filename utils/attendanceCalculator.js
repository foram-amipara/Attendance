/**
 * @param {number} present
 * @param {number} total
 * @param {number} targetPercentage
 * @returns {object}
 */

function calculateBunkOrNeed(present,total,targetPercentage){
    if(!total || total===0){
        return{
            present:0,
            total:0,
            currentPercentage:0,
            targetPercentage,
            status: "NO_DATA",
            classesCount:0,
            message:"No classes cunducted yet"
        };
    }

    const targetDecimal = targetPercentage/100;
    const currentPercentage=Math.round((present/total)*10000)/100;

    if(currentPercentage>targetPercentage){
        const bunkClass=Math.floor((present/targetDecimal)-total);
        return{
            present,
            total,
            currentPercentage,
            targetPercentage,
            status:"ON_TRACK",
            classesCount:bunkClass,
            message:`You can safely bunk ${bunkClass} class.`
        }
    }

    if(currentPercentage<targetPercentage){
        if(targetDecimal===1){
            return{
                present,
                total,
                currentPercentage,
                targetPercentage,
                status: "SHORTAGE",
                classesCount:Infinity,
                message: "Target is 100%, which cannot be recovered after an absence."
            }
        }
        const classNeed=Math.ceil(((targetDecimal*total)-present)/(1-targetDecimal));
        return {
            present,
            total,
            currentPercentage,
            targetPercentage,
            status: "SHORTAGE",
            classesCount: classesNeeded,
            message: `You need to attend next ${classesNeeded} class consecutively.`
        };
    }

    return{
        present,
        total,
        currentPercentage,
        targetPercentage,
        status: "AT_TARGET",
        classesCount: 0,
        message: "You are exactly on track with your target attendance."
    };
}


module.exports={
    calculateBunkOrNeed
};