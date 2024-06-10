
import './footer.scss'
import Qiflix from '../../resources/qiflix.png'

const Footer = () => {
    return (
        <footer className='col-lg-12'>
            <br />
            <div className='footer-child-1 footer-child col-lg-12'>
                Have questions? Contact us.
            </div>
            <div className='footer-child-2 footer-child col-lg-12'>
                <div className="footer-child-item col-lg-3 col-ms-4">
                    <span>Frequently asked questions</span>
                    <span>Relations with investors</span>
                    <span>Privacy</span>
                    <span>Speed ​​test</span>
                </div>
                <div className="footer-child-item col-lg-3 col-ms-4">
                    <span>Help Center</span>
                    <span>Job</span>
                    <span>Cookie preferences</span>
                    <span>Policy notification</span>
                </div>
                <div className="footer-child-item col-lg-3 col-ms-4">
                    <span>Account</span>
                    <span>Ways to view</span>
                    <span>Business information</span>
                    <span>Only available on Netflix</span>
                </div>
                <div className="footer-child-item col-lg-3 col-ms-4">
                    <span>Multimedia center</span>
                    <span>Terms of use</span>
                    <span>Contact us</span>
                </div>
            </div>
            <div className='footer-child-3 footer-child col-lg-12'>
                <img src={Qiflix} width={'15%'} />
                <span>© Qiflix, A VF Company</span>
            </div>
        </footer >
    )
}

export default Footer
