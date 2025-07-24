import {FC, ReactElement, lazy, Suspense, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignUpMutation } from '../auth.service';
import { useSchemaValidation } from '../../shared/hooks/useSchemaValidation';
import { signUpFarmerSchema, signUpCustomerSchema } from '../auth.schema';
import { initalSignupUserData } from '../../shared/utils/data';
import { SignUpCustomerFormInterface, SignUpFarmerFormInterface } from '../auth.interfaces';

import toast from 'react-hot-toast';

import CustomerIcon from '../../../assets/signup/customerOption.svg';
import FarmerIcon from '../../../assets/signup/farmerOption.svg';

import { SignUpFormUnionInterface } from '../auth.interfaces';
import { SignUpPayloadInterface } from '../auth.interfaces';
import SignUpRoleOption from './SignUpRoleOption';

const CustomerFormOption = lazy( () => import('./SignUpFormOptions/CustomerFormOption'));
const FarmerFormOption = lazy( () => import('./SignUpFormOptions/FarmerFormOption')); 

const SignUp: FC = (): ReactElement => {
    const navigate = useNavigate();
    const [selectedOption, setSelectOption] = useState<"customer" | "farmer">('customer');
    const [userInfo, setUserInfo] = useState<SignUpFormUnionInterface>({...initalSignupUserData })
    const [schemaValidation, validationErrors, resetValidationErrors] = useSchemaValidation({
        schema: selectedOption === 'customer' ? signUpCustomerSchema : signUpFarmerSchema, 
        userData: selectedOption === 'customer'
            ? userInfo as SignUpCustomerFormInterface
            : userInfo as SignUpFarmerFormInterface 
    });
    const [actionError, setActionError] = useState<string>('');
    const [signUp ] = useSignUpMutation();

    const onSignUpHandler = async(): Promise<void> => {
        try{    
            // const isValid = await schemaValidation();
            // if(!isValid){
            //     toast.error("Validation Field:");
            //     return;
            // }
            //has try/catch but doesn't thrown error (it returns boolean instead) -> (error won't be trigger)
            //but this is called inside this try/catch so the error will be caught here in catch
            const isValid = await schemaValidation(); 

            if(isValid){
                const fullName = `${userInfo.firstName} ${userInfo.lastName}`
                //Merge FirstName and Lastname
                const userData:SignUpPayloadInterface = {
                    ...userInfo,
                    fullName
                }
                console.log("userData -> signUpPayloadInterface: ", userData);
    
                //.unwrap(), catch any thrown error
                const result = await signUp(userData).unwrap();
                console.log("\n result signUp: ", result);
    
                toast.success("Successfully signed up")
                navigate('/signin');
            }

        }
        catch(err){
            console.log("Global ERROR: ", err);
            //BUG ON BACKEND: instead of returning appropriate error with status code it's returning default 404 not found
            //status 400 expected for 'customer not found' error
            if(err.originalStatus === 404){ //fix it later
                setActionError("You cannot signup right now");
            }
        }
    }

    const handleRoleChange = (role: 'customer' | 'farmer'):void =>{
        if(selectedOption === role)
            return;

        setSelectOption(role); //customer | farmer
        setUserInfo({...initalSignupUserData, userType:role });
        resetValidationErrors();
        setActionError('');
    }

    return (
        <div className='w-full lg:w-[90%] lg:mx-auto h-full py-20 px-2 lg:px-10'>
            <div className="w-full flex flex-col justify-center items-center">
                <h2 className='font-poppins font-semibold text-2xl'> Join our Community </h2>

                <div className='mt-4 text-center'>
                    Whether you're here to discover fresh, local products or to share your harvest with the 
                    community — you're in the right place. Choose your role to get started."
                </div>
            </div>

            <div className=''>
                <h3 className='font-semibold text-center pt-20 text-xl'> Select your role to continue registration: </h3>
            </div>

            <div className='w-full flex flex-col items-center justify-center mt-8 gap-8 cursor-pointer md:flex-row'>
                
                <SignUpRoleOption 
                    title='Customer'
                    description='Discover and buy directly from local farmers.'
                    selected={selectedOption === 'customer'} //selected is only if it's customer
                    icon={CustomerIcon}
                    onSelect={() => handleRoleChange('customer')}
                />

                <SignUpRoleOption 
                    title='Farmer'
                    description='Discover and buy directly from local farmers.'
                    selected={selectedOption === 'farmer'} //selected is only if it's customer
                    icon={FarmerIcon}
                    onSelect={() => handleRoleChange('farmer')}
                />
            </div>

            {/* 
                Options to achive correct item order
                1. Use flex-col(mobile) and flex-row(desktop) with w-full or w-1/2  instead of using 'order' prop
                2. User 'order' prop to display Items in correct order depends on the view size ()
            */}
            <div className='w-[90%] mx-auto lg:w-full flex flex-col gap-2 font-lato'>
                {/* lazy load this and display it based on selectedOption value */}
                <Suspense fallback={<div>Loading form...</div>}>
                    {selectedOption === 'customer' && 
                        <CustomerFormOption 
                            userInfo={userInfo}
                            setUserInfo={setUserInfo}
                            validationErrors={validationErrors}
                            actionError={actionError}
                        />
                    }
                    {selectedOption === 'farmer' &&
                        <FarmerFormOption 
                            userInfo={userInfo}
                            setUserInfo={setUserInfo}
                            validationErrors={validationErrors}
                            actionError={actionError}
                        />
                    }
                </Suspense>

                <button 
                    className="w-full max-w-[300px] mx-auto p-2 mt-6 border-2 rounded-md text-white bg-green7" 
                    onClick={onSignUpHandler}
                > SignUp
                </button>
            </div>

            
        </div>
    )
}

export default SignUp;