import React, {useContext, useEffect, useState} from 'react';
import {Image} from "react-bootstrap";
import {getImage} from "../../httpRequests/userAPI";
import {Context} from "../../index";

const Avatar = ({width = 100, _id, bigVariant = false, variant}) => {
    const {user} = useContext(Context);
    const [url, setUrl] = useState('');
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getImage(user, _id);
                setUrl(data);
            } catch (error) {
            }
        }

        fetchData();

    }, [user, _id]);
    return (
        <>
            {
                bigVariant
                    ?
                    (
                        variant === 1
                            ?
                            <Image src={url}
                                   style={{
                                       width: '100%',
                                       height: '15vmin',
                                       objectFit: 'cover',
                                       opacity: 0.5,
                                       filter: 'blur(80px)',
                                   }} className="animated-opacity"
                            />
                            :

                            <Image
                                src={url}
                                style={{
                                    objectFit: 'cover',
                                    aspectRatio: '1',
                                    width: '20vmin',
                                    borderRadius: '50%'
                                }}
                            />
                    )


                    :
                    <Image src={url}
                           style={{
                               width: width, height: width, objectFit: 'cover',
                               aspectRatio: '1', borderRadius: '50%'
                           }}
                    />

            }
        </>

    );
};

export default Avatar;