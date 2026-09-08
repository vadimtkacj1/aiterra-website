import Image from "next/image";

export default function SocialFollow() {
  const socialLinks = [
    { name: "Instagram", icon: "/images/lp/instagram.svg", url: "https://instagram.com" },
    { name: "Facebook", icon: "/images/lp/facebook.svg", url: "https://facebook.com" },
    { name: "LinkedIn", icon: "/images/lp/linkedin.svg", url: "https://linkedin.com" },
    { name: "TikTok", icon: "/images/lp/tiktok.svg", url: "https://tiktok.com" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="relative w-full h-80 mb-8">
            <Image
              src="/images/lp/social-girl.svg"
              alt="Follow us on social media"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2" dir="rtl">
              <span
                className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent"
              >
                עקבו אחרינו ברשתות
              </span>
              {" "}
              <span>וראו איך בונים מותגים</span>
            </h2>
            <p className="text-xl font-bold text-blue-600" dir="rtl">
              שמובילים שוק
            </p>
          </div>

          <div className="flex justify-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-20 h-20 flex items-center justify-center rounded-full transition-colors"
              >
                <Image
                  src={social.icon}
                  alt={social.name}
                  width={48}
                  height={48}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
