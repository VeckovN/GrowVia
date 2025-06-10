import { FC } from 'react';
import { RoleOptionInterface } from '../auth.interfaces';

const SignUpRoleOption: FC<RoleOptionInterface> = ({title, description, selected, icon, onSelect}) => {
    return (
        <div className={`w-[260px] max-w-[300px] gap-2 py-2 px-1 flex flex-col justify-center items-center border-2 rounded-lg text-lg font-lato
            hover:bg-gray-200 hover:border-4 group	
            ${selected ? 'text-green6 border-green6 border-4' : 'text-black border-gray-500'}
        `}
        onClick={onSelect}
        >
            <div className='group-hover:font-bold '>{title}</div>
            {/* use as svg to allow color changing */}
            <img
                className='w-28 h-28'
                alt={title}
                src={icon}
            />
            <p className='text-center'>{description}</p>
        </div>
    )
}

export default SignUpRoleOption;