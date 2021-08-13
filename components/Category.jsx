import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Category.module.css';

const Category = ({ image, name }) => {
    return (
        <div className={styles.card}>
            <Link href={`/category/${name.toLowerCase()}`}>
                <div>
                    <Image className={styles.image} src={image} height={700} width={1300} />
                    <h3 className={styles.info}>{name}</h3>
                </div>
            </Link>
        </div>
      );
    };

export default Category;
