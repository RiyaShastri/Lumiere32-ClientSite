import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CountryIsoService } from '../../../services/country-iso.service';
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {


  whoWeAre = [
    {
      image: "assets/images/about/mission.png",
      heading: "OUR MISSION", message: `We democratize data for the healthcare professionals, simplifying their procurement
      processes, helping medical device brands start the journey of digitization.`},

    {
      image: "assets/images/about/vission.png",
      heading: "OUR VISION", message: `We strive towards building a company that enables healthcare professionals to
      manage their clinics more efficiently across the globe, creating equal opportunities
      for all.`},

    {
      image: "assets/images/about/people.png",
      heading: "PEOPLE", message: `We aim to inspire people with our organization, so they feel valued as a
      customer.`},

    //   {
    //     image: "assets/images/about/partner.png",
    //     heading: "PARTNERS", message: `At Lumiere32 we envision it to bridge the disri
    // bution gap between dealers and clinicians, through
    // its robust online platform between the dealers
    // and clinicians, through its robust online platform`},

    //   {
    //     image: "assets/images/about/plenet.png",
    //     heading: "PLANET", message: `At Lumiere32 we envision it to bridge the disri
    // bution gap between dealers and clinicians, through
    // its robust online platform between the dealers
    // and clinicians, through its robust online platform`},

    //   {
    //     image: "assets/images/about/prod.png",
    //     heading: "PRODUCTIVITY", message: `At Lumiere32 we envision it to bridge the disri
    // bution gap between dealers and clinicians, through
    // its robust online platform between the dealers
    // and clinicians, through its robust online platform`}

  ]

  meetTeam = [
    {
      img: "assets/images/team/priti.jpg", name: "Dr Priti Bhole", designation: "Founder & COO",
      details: `Dr. Priti is a dentist by profession, working extensively as a full-time dentist and a clinic
    manager in India. Her experience means that she brings an in-depth understanding of
    the dental device market in the Asia-pacific region` },
    {
      img: "assets/images/team/raman.jpg", name: "Raman Chauhan", designation: "Co-Founder & CEO",
      details: `Raman is a technology evangelist and enthusiast in strategy, market research, and
    analytics. He has experience working for clients like Cisco, Microsoft, and IBM, providing
    Raman with the talent to guide the client through every stage in their journey.` },
    // {
    //   img: "assets/images/team/maarten.jpg", name: "Maarten Kelder", designation: "Board Advisor",
    //   details: `Maarten has over 30 years of experience driving growth, business transformation, and
    // innovation across many industries, such as healthcare, life sciences, and consumer
    // goods. He was most recently the EVP for Strategy and Corporate Development at Zuellig
    // Pharma, Asia's leading multi-billion-dollar healthcare services provider.` },
    // {
    //   img: "assets/images/team/swetank.jpg", name: "Swetank Sisodia", designation: "Co-Founder & CTO",
    //   details: `Swetank holds an MBA in marketing and strategy from the Indian Institute of
    // Management Lucknow. He is a proactive, passionate, and strategic thinker who loves
    // experimenting with new technologies. He has also worked for clients like Morgan Stanley,
    // Intercontinental Exchange, and SunTrust Bank in his career.`},
    // {
    //   img: "assets/images/team/richa.jpg", name: "Richa Chauhan", designation: "Director of Strategic Partnerships",
    //   details: `Richa is a legal professional and Project Lead, analyzing and working on numerous
    //   intellectual property cases over the last six years. Her experience in the technology world
    //   and with corporate IP law makes Richa vital to Strategic Partnerships.`},
    {
      img: "assets/images/team/Richa.png", name: "Richa Chauhan", designation: "Director-Strategic Partnerships",
    },
    {
      img: "assets/images/team/Swetank.png", name: "Swetank Sisodia", designation: "Co-Founder & CTO ",
    },

    {
      img: "assets/images/team/shilpi.jpg", name: "Shilpi Verma", designation: "Operations Manager",
      details: `Shilpi is a dental surgeon by profession, practicing general dentistry in India for years
      before joining Lumiere32 as Operations Manager. Most recently, she received a post-
      graduate certificate in clinical trial management from the National University of
      Singapore.`},
    {
      img: "assets/images/team/sweety.jpg", name: "Sweety Asati", designation: "Key Accounts Manager",
      details: `Sweety is a dental practitioner who graduated with a bachelor's degree in dental surgery.
      She has prior experience working as a general practitioner in India, taking on various
      roles and gaining a comprehensive knowledge of the dental industry’s operations.`},
    // {
    //   img: "assets/images/team/shivank.jpg", name: "Shivank Srivastava", designation: "Senior Software Engineer",
    //   details: `Shivank is a software engineer who drives on solving complex challenges to drive digital
    //   transformation at Lumiere32. He has a wide range of programming expertise and has
    //   provided technological solutions for sales force automation, ERP, CRM, and Employee
    //   Management Systems.`},
    // {
    //   img: "assets/images/team/srishti.jpg", name: "Srishti Jain", designation: "Sales & Marketing Executive",
    //   details: `Srishti assists our in-house digital marketing team by creating and managing digital
    //   campaigns. She holds a post-graduate diploma in Management with a specialization in
    //   marketing. Before joining Lumiere32, she began a career with Nestle India, excelling in
    //   various domains, such as sales, digital marketing, and revenue generation.`},
    // {
    //   img: "assets/images/team/sahil.jpg", name: "Sahil Arora", designation: "Module Lead",
    //   details: `Sahil works to support the web team at Lumiere32, operating both the frontend and the
    //   backend of our website and application. Over the last five years, he has gained
    //   professional experience in different technologies like Angular, Node, Python, and
    //   JavaScript, only to name a few.`},
    // {
    //   img: "assets/images/team/deepika.jpg", name: "Deepika Bhandari", designation: "Sales & Operations Team Lead (USA)",
    //   details: `Deepika is a graduate of Delhi University and holds a bachelor's degree in Philosophy
    //   Honors. At Lumiere32, she has joined our partner office in the U.S. to manage day-to-
    //   day operations.`},
    // {
    //   img: "assets/images/team/emma.jpg", name: "Emma Phang", designation: "Sales Support",
    //   details: `Emma is a dental industry veteran with over 30 years of experience in sales and
    //     marketing, working closely with dentists and nurses in Singapore for decades before
    //     joining Lumiere32.`},
    // {
    //   img: "assets/images/team/leena.jpg", name: "Leena Madan", designation: "Product Analyst",
    //   details: `Leena holds a bachelor's degree as well as a master's degree in Computer Science. She
    //       has published six research papers at national conferences and has worked on various
    //       projects sponsored by Microsoft, World Economic Forums, and NPTEL.`},
    // {
    //   img: "assets/images/team/dhanashree.jpg", name: "Dhanashree Bhole", designation: "Catalogue Specialist",
    //   details: `Dhanashree holds a degree in Commerce and Computer Science, working in India’s e-
    //   commerce industry for over 12 years before joining the team at Lumiere32.`},
    // {
    //   img: "assets/images/team/Sweta.jpg", name: "Sweta Makecha", designation: "Operations & Partner Accounts",
    //   details: `Sweta is a dentist by profession, practicing clinical dentistry for four years in India. She
    //   has had the opportunity to explore dental research for National Dental Centre Singapore,
    //   and she has worked as an online tutor and content provider for Pharmacad in her career.`},
    {
      img: "assets/images/team/Srishti.png", name: "Srishti Jain", designation: "Senior Marketing Executive",
    },
    {
      img: "assets/images/team/Shafiqah.png", name: "Shafiqah R.", designation: "Operations Executive",
    },
    {
      img: "assets/images/team/Normazida.png", name: "Normazida", designation: "Business Dev. Manager",
    },
    {
      img: "assets/images/team/Ahmad.png", name: "Ahmad Anggi Hakim", designation: "Inside Sales Executive",
    }, {
      img: "assets/images/team/Ginni.png", name: "Ginni Ngo", designation: "Accounts Executive",
    },
    {
      img: "assets/images/team/Niharika.jpg", name: "Niharika Rana", designation: "Junior Marketing Analyst",
    }
  ]

  press = [
    { img: "assets/images/aboutus/news1.PNG", info: "5 Singaporean companies that are playing a crucial role in keeping coronavirus at bay", pageLink: "https://sea.mashable.com/culture/10340/5-singaporean-companies-that-are-playing-a-crucial-role-in-keeping-coronavirus-at-bay" },
    { img: "assets/images/aboutus/blog-2.jpg", info: "How This Power Couple Ensures S'pore Has A Stable Supply Of Medical Equipment During COVID-19", pageLink: "https://vulcanpost.com/699985/lumiere32-medical-supplies-singapore" },
    { img: "assets/images/aboutus/article3.jpg", info: "Lumiere32 Enters Malaysia to Fully Digitalise the Local Medical Supply Procurement Process", pageLink: "https://www.healthmatters.com.my/medical-supplies-distribution-platform-lumiere32-enters-malaysia-to-fully-digitalise-the-local-medical-supply-procurement-process/" },
    { img: "assets/images/aboutus/article4.jpg", info: "Lumiere32 To Digitalise The Medical Supply Procurement Process", pageLink: "https://www.businesstoday.com.my/2021/10/28/lumiere32-to-digitalise-the-medical-supply-procurement-process/" },

  ]

  details = [
    { img: "assets/images/aboutus/nus.png", info: "Incubated and Supported By" },
    { img: "assets/images/aboutus/grab.png", info: "Our Financing Partners" },
  ]

  constructor(private titleService: Title, private countryIso: CountryIsoService) {

    this.titleService.setTitle(this.countryIso.MessageTitile.aboutUs);
  }

  ngOnInit(): void {
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }
}
