import { h } from 'preact';
import imgURL from '../../style/back_logo.png';
const Header = () => (
	<header className="top">
		<img className="logo" src={imgURL} alt=""/>
	</header>
);
export default Header;
