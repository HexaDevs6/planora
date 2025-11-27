import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Users, Send, MessageSquare } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";
import { MagicCard } from "@/components/ui/magic-card";
import { useDirection } from "@/hooks/useDirection";


const Contact = () => {

  const { lang } = useDirection();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus(null);

    const form = e.target;
    const formDataObj = new FormData(form);

    const json = JSON.stringify(Object.fromEntries(formDataObj));

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });

      const data = await res.json();

      if (data.success) {
        setFormStatus("success");
        form.reset();
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setFormStatus("error");
      }
    } catch (err) {
      setFormStatus("error");
    }
  };


  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      titleAr: "ارسل لنا بريد الكتروني",
      details: "hexadevs06@googlegroups.com",
      link: "mailto:hexadevs06@googlegroups.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      titleAr: "اتصل بنا عبر الهاتف",
      details: "+20 (120) 194-9677",
      link: "tel:+201201949677",
    },
    {
      icon: Users,
      title: "Join Our Community",
      titleAr: "انضم إلى مجتمعنا",
      details: "Discord/HexaDevs",
      link: "https://discord.gg/8kG9zaUKwS",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">

        {/* Header Section */}
        <section className="border-b">
          <div className="container py-24">
            <div className="max-w-3xl mx-auto text-center space-y-4 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-forground text-forground text-sm font-medium mb-4">
                <MessageSquare className="h-4 w-4 text-[#FFA704]" />
                <span>{lang === "ar" ? "نحن هنا لمساعدتك" : "We're Here to Help"}</span>
              </div>

              <h1
                className="text-4xl md:text-5xl font-bold text-[#FFA704] dark:text-[#FFC54D] drop-shadow-[0px_4px_5px_rgba(0,0,0,0.15)]"
              >
                {lang === "ar" ? "اتصل بنا" : "Get in Touch"}
              </h1>


              <p className="text-lg text-muted-foreground">
                {lang === "ar" ? "هل لديك أسئلة؟ نحن سعداء بالسمع منك. ارسل لنا رسالة وسنجيبك في أقرب وقت ممكن." : "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 bg-gradient-violet">
          <div className="container px-4 md:px-6">
            <h2 className="text-center text-gradient-amber drop-shadow-xl text-2xl md:text-4xl font-bold mb-8">
              {lang === "ar" ? "اتصل الآن" : "Quick Contacts"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {contactInfo.map((info, index) => (
                <a
                  key={info.title}
                  href={info.link}
                  target={info.link.startsWith("http") ? "_blank" : undefined}
                  rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  <Card className="h-full border-0 shadow-xl relative bg-violet-dark/20 backdrop-blur-2xl p-0 group">
                    <ShineBorder
                      shineColor={["#A07CFE", "#FE8FB5", "#FFA704"]}
                    />
                    <CardContent className="p-6 text-center space-y-3">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-full
  bg-[#FFA704] text-violet shadow-md hover:shadow-lg transition-all duration-300 mx-auto"
                      >
                        <info.icon className="h-7 w-7" />
                      </div>


                      <h3 className="font-semibold text-lg text-white">
                        {lang === "ar" ? info.titleAr : info.title}
                      </h3>
                      <p className="text-gray-300 text-sm group-hover:underline">
                        {info.details}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id='contact-form' className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <MagicCard
                className="rounded-xl"
                gradientColor="#FFA70430"
                gradientSize={500}
                gradientFrom="#c909b6"
                gradientTo="#FFA704"
              >
                <Card className="border-0 bg-transparent">
                  <CardContent className="p-8 md:p-12">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gradient-amber drop-shadow-sm">
                        {lang === "ar" ? "ارسل لنا رسالة" : "Send Us a Message"}
                      </h2>
                      <p className="text-muted-foreground">
                        {lang === "ar" ? "املأ النموذج أدناه وسنجيبك قريبا" : "Fill out the form below and we'll get back to you shortly"}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                      <input type="hidden" name="access_key" value="e5f98c8e-5d78-463d-9428-e09579328c41" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">{lang === "ar" ? "الاسم الكامل" : "Full Name"} *</label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">{lang === "ar" ? "البريد الالكتروني" : "Email Address"} *</label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">{lang === "ar" ? "العنوان" : "Subject"} *</label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="How can we help you?"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">{lang === "ar" ? "الرسالة" : "Message"} *</label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us more about your inquiry..."
                          rows={6}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="hero"
                        size="lg"
                        className="w-full md:w-auto bg-[#FFA704] hover:bg-[#e19500] text-white font-semibold transition-all"
                      >
                        <Send className="mr-2 h-5 w-5" />
                        {lang === "ar" ? "ارسل الرسالة" : "Send Message"}
                      </Button>

                      {/* Success Message */}
                      {formStatus === "success" && (
                        <p className="text-green-600 font-medium pt-2">
                          ✔️ {lang === "ar" ? "تم ارسال الرسالة بنجاح!" : "Your message has been sent successfully!"}
                        </p>
                      )}

                      {/* Error Message */}
                      {formStatus === "error" && (
                        <p className="text-red-600 font-medium pt-2">
                          ❌ {lang === "ar" ? "حدث خطأ. يرجى المحاولة مرة أخرى لاحقا." : "Something went wrong. Please try again later."}
                        </p>
                      )}
                    </form>

                  </CardContent>
                </Card>
              </MagicCard>
            </div>
          </div>
        </section>

        {/* FAQ Teaser */}
        <section className="py-16 bg-gradient-violet text-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-center text-[#FFA704] drop-shadow-xl text-2xl md:text-4xl font-bold mb-8">
                {lang === "ar" ? "هل تبحث عن إجابة سريعة؟" : "Looking for Quick Answers?"}
              </h2>
              <p className="text-gray-300">
                {lang === "ar" ? "تحقق من قسم الأسئلة الشائعة لدينا للإجابة على الأسئلة الشائعة" : "Check out our FAQ section for instant answers to common questions"}
              </p>
              <Button
                variant="outline"
                size="lg"
                className="text-violet-dark border-[#FFA704] hover:bg-[#FFA704]/20 transition-all"
              >
                {lang === "ar" ? "زيارة الأسئلة الشائعة" : "Visit FAQ"}
              </Button>
            </div>
          </div>
        </section>

      </main>
    </div>

  );
};

export default Contact;
