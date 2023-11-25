
import './section.scss'
import { SectionPublicPageProps } from '../../interfaces'
import QiflixOnTV from '../../../../resources/qiflix-on-tv.png'
import QiflixOnPhone from '../../../../resources/qiflix-on-phone.png'
import QiflixEveryWhere from '../../../../resources/qiflix-everywhere.png'

const SectionPublicPage = ({ reverse, header, message, indexImage }: SectionPublicPageProps) => {

  return (
    <div id='section-public-page' style={reverse ? { flexDirection: 'row-reverse' } : undefined}>
      <div className="section-left-child section-child">
        <h2>{header}</h2>
        <p>{message}</p>
      </div>
      <div className="section-right-child section-child">
        <img src={indexImage == 1 ? QiflixOnTV : indexImage == 2 ? QiflixOnPhone : QiflixEveryWhere} width={'80%'} />
      </div>
    </div>
  )
}

export default SectionPublicPage
