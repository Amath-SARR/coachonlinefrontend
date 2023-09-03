export default function getWixLink(subscription = { name: '' }) {
  const subscriptionName = subscription.name.toLowerCase().trim().split(' ').join('');
  return wixLinks[subscriptionName] || wixLinks.homepage;
}

export const wixLinks = {
  homepage: { url: 'https://www.coachs-online.com/accueillandingpart1' },
  homepageAffiliation: { url: 'https://www.coachs-online.com/affiliation' },
  coachAffiliation: { url: 'https://www.coachs-online.com/boite-a-outils' },
  nosubscription: { url: 'https://www.coachs-online.com/modedecouverte' },
  monthly: { url: 'https://www.coachs-online.com/abon1490' },
  monthlystudent: { url: 'https://www.coachs-online.com/abonetudiant' },
  studentmonthly: { url: 'https://www.coachs-online.com/abonetudiant' },
  yearly: { url: 'https://www.coachs-online.com/abon990' },
};
