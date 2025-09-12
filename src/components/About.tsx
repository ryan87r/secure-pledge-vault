import { Shield, Lock, Eye, Users, Zap, Globe } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Military-Grade Security",
      description: "End-to-end encryption ensures your pledges remain completely private until milestone reveals."
    },
    {
      icon: Lock,
      title: "Anonymous Backing",
      description: "Support creators without revealing your identity or financial capacity to other backers."
    },
    {
      icon: Eye,
      title: "Milestone Transparency",
      description: "Smart contracts automatically reveal funding progress at 25%, 50%, and 75% milestones."
    },
    {
      icon: Users,
      title: "Fair Competition",
      description: "Projects succeed based on merit and community support, not whale influence."
    },
    {
      icon: Zap,
      title: "Instant Releases",
      description: "Automated fund distribution when milestones are reached, ensuring creator accountability."
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Decentralized platform accessible worldwide with support for multiple cryptocurrencies."
    }
  ];

  return (
    <section id="about" className="py-20 bg-privacy-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            About PrivateFund
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            We're revolutionizing crowdfunding by putting privacy first. Our platform protects both creators and backers 
            while maintaining transparency through smart milestone-based reveals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-card/10 backdrop-blur-sm rounded-xl p-6 border border-privacy-primary/20 hover:border-privacy-primary/40 transition-all duration-300">
              <div className="bg-privacy-primary/20 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-privacy-primary" />
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-white/70 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="bg-card/5 backdrop-blur-sm rounded-2xl p-8 border border-privacy-primary/20 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">
              Our Mission
            </h3>
            <p className="text-white/80 text-lg">
              To create a crowdfunding ecosystem where innovation thrives without compromising privacy or fairness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-privacy-primary">For Creators</h4>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-start">
                  <span className="text-trust-green mr-2">•</span>
                  <span>Launch projects without revealing backer identities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-trust-green mr-2">•</span>
                  <span>Build genuine community support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-trust-green mr-2">•</span>
                  <span>Receive funds automatically at milestones</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-privacy-primary">For Backers</h4>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-start">
                  <span className="text-trust-green mr-2">•</span>
                  <span>Support projects without revealing wealth</span>
                </li>
                <li className="flex items-start">
                  <span className="text-trust-green mr-2">•</span>
                  <span>Avoid targeted marketing and exploitation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-trust-green mr-2">•</span>
                  <span>Ensure funds are used responsibly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;