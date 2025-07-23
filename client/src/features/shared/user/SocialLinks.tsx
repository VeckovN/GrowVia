
import { UserSocialInterface } from './user.interface';

import FacebookIcon from '../../../assets/social/facebook.svg';
import InstagramIcon from '../../../assets/social/instagram.svg';
import LinkedinIcon from '../../../assets/social/linkedin.svg';
import TiktokIcon from '../../../assets/social/tiktok.svg';
import TwitterIcon from '../../../assets/social/twitter.svg'

const SocialLinks: React.FC<UserSocialInterface> = ({ links }) => {
    if (!links) return null;

    const getSocialUrlIcon = (name: string) => {
        switch (name.toLowerCase()) {
            case 'facebook':
                return FacebookIcon;
            case 'instagram':
                return InstagramIcon;
            case 'linkedin':
                return LinkedinIcon;
            case 'tiktok':
                return TiktokIcon;
            case 'twitter':
                return TwitterIcon;
            default:
                return ''; // or a default icon if you want
        } 
    }

    return (
    <>
        {links.map(el =>(
            el.url?.trim() ? (
            <a 
                className=''
                href={el.url}
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    className='h-8 xs:h-10'
                    src={getSocialUrlIcon(el.name)}
                    alt={`${el.name}-icon`}
                />
            </a>
            ) 
            : 
            null 
        ))}
    </>
    );
};

export default SocialLinks;