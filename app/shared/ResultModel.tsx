class ResultModel{
    data = null;
    errorMessages = [];
    isSuccessful = false;

    constructor(data: any, errorMessages: [], isSuccessful: boolean) {
        this.data = data;
        this.errorMessages = errorMessages;
        this.isSuccessful = isSuccessful;
    }

    
}

export default ResultModel;
