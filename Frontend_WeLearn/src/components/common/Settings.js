import settingLogo from './settingLogo.png'
import styles from './setting.css'

function Settings(){
    return (
        <div className="settings-link">
             <a href="#" className="settings">
                <img src={settingLogo} alt="Setting Logo" />
             </a>
        </div>
    )
}
export default Settings;