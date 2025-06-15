import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: '1.8rem',
                  background: 'linear-gradient(to right, var(--primary-color), var(--info-color))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                  marginRight: '12px', // Space for the dot
                }}
              >
                zuma
              </h2>
              <span
                style={{
                  position: 'absolute',
                  width: '8px',
                  height: '8px',
                  background: 'var(--primary-color)', // Assuming --primary-color is globally defined
                  borderRadius: '50%',
                  bottom: '6px', // Adjust for vertical alignment
                  right: '0px',
                  // boxShadow: '0 0 6px 1px var(--primary-color)', // Optional: if you want the glow
                }}
              ></span>
            </div>
            <p className="mb-4 text-gray-400">
              The next generation platform for building and deploying intelligent AI agents that automate complex tasks.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-github"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-discord"></i></a>
            </div>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Product</h5>
            <ul className="space-y-2">
              <li><Link href="/#features" className="text-gray-400 hover:text-white">Features</Link></li>
              <li><Link href="/#pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Case Studies</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Documentation</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Resources</h5>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">Blog</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Tutorials</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Support</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">API Reference</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Company</h5>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Careers</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Press Kit</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sintra Platforms. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
