import { useState } from "react";
import { ValidationError } from "yup";
import { useAuthValidationInterface } from '../auth.interfaces';

export type ValidationErrorsType = { field:string; message: string};

//map approach ismore efficient then array -> {object with }
//instead array of {field,message} it will be tuple {field: '', message:''}
//and user won't be force to map thought the array to get specific field message
//it will be allowed to direcly take message beased on 'field.email'

export type ValidationErrorMap = Record<string, string>;

const useAuthValidation =({ schema, userData }:useAuthValidationInterface): [() => Promise<boolean>, ValidationErrorMap] => {
    const [validationErrors, setValidationErrors] = useState<ValidationErrorMap>({});

    const schemaValidation = async (): Promise<boolean> => {
        try {
            await schema.validate(userData, { abortEarly: false });
            setValidationErrors({});
            return true;
        }
        catch (err) {
            if(err instanceof ValidationError){
                //use reduce and put everyting in accomulator {}
                const errorMap = err.inner.reduce<ValidationErrorMap>((acc, curr) => {
                    if (curr.path){
                        acc[curr.path] = Object.values(curr.message)[0];
                    }
                    return acc;
                }, {} as ValidationErrorMap); 
                setValidationErrors(errorMap);
            } 
            // else {
            //     //another (general: error) -> it takes any error that occurs
            //     setValidationErrors({_general: "An unexpected error occured"});
            // }
            return false;
        }
    };
    
    return [schemaValidation, validationErrors];
};

export { useAuthValidation }