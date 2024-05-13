"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next-intl/link";
import { useParams } from "next/navigation";
export default function News() {
    const locale = useLocale();
    const params: any = useParams<{ locale: string; id: string }>();
    const content = {
        "topic": ["Food", "New Branch", "Big sale", "Best restaurant", "Recruitment"],
        "title": ["Our latest pizza is now available at our restaurant!", 
                    "Elevating Your Dining Experience: Discover the Unforgettable at Our New Restaurant Branch!",
                    "Feast Your Way to Savings: Unleashing Flavorful Deals on Black Friday!",
                    "Taste the Refined Excellence: Join us at One of the Top 5 Best Restaurants for an Unforgettable Culinary Journey!",
                    "Join Our Culinary Family: Where Passion and Talent Create Extraordinary Dining Experiences!"
                ],
        "writer": ["Luong Nguyen", "Hung Nguyen", "Vuong Lieu", "Tony Dang", "Louis Wang"],
        "publish_date": ["20/5/2024", "2/5/2024", "20/4/2024", "1/4/2024", "15/3/2024"],
        "content_1": ["Introducing the pizza revolution you've been waiting for! Prepare to be blown away by our innovative new pizza creation that will redefine your perception of cheesy goodness. We've taken everything you love about pizza and elevated it to new heights, crafting a culinary masterpiece that will leave you craving for more. Our artisanal dough is meticulously handcrafted using a secret blend of premium flours, resulting in a crust that is both delightfully crispy and irresistibly chewy. But the true magic lies in our extraordinary selection of toppings. Say goodbye to the ordinary and embrace the extraordinary with an array of unique flavor combinations that will tantalize your taste buds. From succulent BBQ pulled pork to zesty roasted garlic and truffle oil, each ingredient is carefully sourced and thoughtfully paired to create a symphony of flavors. And let's not forget about the cheese! We've scoured the world to find the finest, most decadent cheeses that will melt into a creamy, gooey perfection that will have you reaching for another slice. Whether you're a traditionalist who craves the classic Margherita or an adventurous foodie seeking a bold fusion of global tastes, our new pizza has something to satisfy every craving. So, gather your friends, unleash your appetite, and join us on a culinary adventure that will transport you to pizza paradise. Don't just eat pizza, experience pizza like never before. Visit us today and be among the first to indulge in the revolution of flavor that is our new pizza masterpiece. Your taste buds will thank you.",
                      "Attention all food enthusiasts and discerning palates! We are thrilled to announce the grand opening of our new restaurant branch, where culinary dreams come to life. Prepare to immerse yourself in a world of extraordinary flavors and impeccable dining experiences. Nestled in the heart of Ho Chi Minh city, our new branch is a haven for those seeking a gastronomic adventure like no other. Step into a stylish and inviting space that exudes warmth and elegance, setting the stage for an unforgettable meal. Our talented team of chefs, renowned for their culinary prowess, have crafted a menu that showcases the finest ingredients sourced from local farmers and artisans. From the vibrant and artfully plated appetizers to the exquisitely crafted main courses, every dish tells a story, a symphony of flavors that will transport you to culinary bliss. Whether you're celebrating a special occasion, enjoying a romantic dinner for two, or simply treating yourself to an exceptional meal, our new restaurant branch promises to exceed your expectations and create memories to cherish.",
                      "It's time to satisfy your cravings and indulge in a feast of flavors at our highly anticipated Black Friday Big Sale in our restaurant. We're rolling out the red carpet for this special event, offering you an incredible opportunity to experience our exquisite cuisine at irresistible prices. From delectable appetizers to mouthwatering main courses and divine desserts, our menu is a symphony of culinary delights that will leave you in awe. Whether you're a fan of international cuisine, a lover of comfort food, or an adventurer seeking bold flavors, our restaurant has something for everyone. Prepare your taste buds for a culinary journey like no other, as our talented chefs showcase their creativity and passion on every plate. Don't miss this chance to dine in style and indulge in a gastronomic experience that will exceed your expectations.",
                      "Welcome to a culinary experience like no other, where excellence meets indulgence. We are thrilled to announce that our restaurant has been ranked among the top 5 best restaurants, and we invite you to join us on this extraordinary gastronomic journey. Prepare to be captivated by our refined ambiance, impeccable service, and, of course, our exceptional cuisine. Our award-winning chefs have crafted a menu that showcases the finest ingredients, carefully selected from local farmers and artisans. Every dish is a masterpiece, meticulously prepared and artfully presented to delight both your taste buds and your eyes. From the first tantalizing bite to the last lingering taste, each culinary creation is a testament to our commitment to excellence. Experience the flavors that have earned us this prestigious recognition and discover why we are ranked among the best restaurants in [location]. Indulge in a dining experience that will leave you in awe and create memories to cherish for a lifetime.",
                      "We are excited to announce that our esteemed restaurant is now hiring exceptional individuals to join our passionate team. If you have a love for food, a flair for hospitality, and a desire to create memorable dining experiences, this is your opportunity to be part of something truly extraordinary. As a member of our team, you will have the chance to work alongside talented chefs, dedicated servers, and skilled professionals who share a common goal: to deliver unparalleled service and culinary excellence. We value creativity, teamwork, and a commitment to excellence in all aspects of the dining experience. Whether you are an experienced industry veteran or just beginning your career, we offer a supportive and nurturing environment where you can thrive and grow. Join us on this exciting culinary journey and become an integral part of our restaurant's success."
                    ]
                    ,
        "image": ["/news.jpg",
                  "https://res.cloudinary.com/djdpobmlv/image/upload/v1714978347/%22General%22/photo-1714752890679-7f329ccaa6de_l9xzww.jpg",
                  "https://res.cloudinary.com/djdpobmlv/image/upload/v1714978732/%22General%22/photo-1607082351305-62d667815b4a_jggp1s.jpg",
                  "https://res.cloudinary.com/djdpobmlv/image/upload/v1714979515/%22General%22/360_F_316016017_eRRs0wfGneyPguUhwIbQkKlN9RZhl5GG_wwvfwb.jpg",
                  "https://res.cloudinary.com/djdpobmlv/image/upload/v1714979967/%22General%22/images_t6i09z.png"
                 ],
        "content_2": ["The result is a pizza that transcends the ordinary and ventures into the realm of extraordinary. Bite into our perfectly baked crust, and you'll be greeted with a symphony of flavors that will ignite your senses. The tangy tomato sauce, bursting with the essence of sun-ripened tomatoes and fragrant herbs, serves as the canvas for a masterpiece of toppings. Sink your teeth into a medley of premium ingredients, from juicy grilled chicken to caramelized onions, from fresh basil leaves to smoky bacon, all harmoniously coming together to create a taste sensation that will leave you in awe. The cheese, oh the cheese! Stretchy, melty, and oh-so-satisfying, it blankets the pizza in a layer of creamy indulgence. Each bite is a revelation, a perfect balance of textures and flavors that will transport you to pizza heaven. Are you ready to experience pizza perfection? Come and savor our new creation and prepare to be amazed.",
                      "We have meticulously designed this dining haven to offer an unparalleled experience that will delight all your senses. From the moment you step through the doors, you'll be greeted by a warm and inviting ambiance that sets the stage for an extraordinary meal. Our dedicated team of passionate chefs and attentive staff are committed to providing impeccable service and ensuring that every detail is perfectly curated for your enjoyment. The menu is a celebration of culinary artistry, featuring a harmonious blend of flavors and textures that showcase the finest ingredients. From innovative twists on classic favorites to bold and daring creations, each dish is a masterpiece in its own right. Treat yourself to an unforgettable dining experience at our new restaurant branch, where moments are savored and memories are made. Come and join us as we embark on this exciting culinary adventure together.",
                     "Calling all food lovers and epicurean enthusiasts! Get ready to celebrate Black Friday in the most delicious way possible at our restaurant's highly anticipated Big Sale. We're pulling out all the stops to bring you an extraordinary dining experience at unbeatable prices. From the moment you step through our doors, you'll be greeted by a warm and inviting ambiance, setting the stage for an unforgettable meal. Our dedicated team of culinary experts has crafted a menu that showcases the finest ingredients, expertly prepared to tantalize your taste buds. Whether you're craving succulent steaks, fresh seafood, vibrant vegetarian dishes, or irresistible desserts, our Black Friday Big Sale has something to satisfy every palate. Gather your friends and family, and join us for a culinary celebration where exceptional flavors meet incredible value. Don't miss out on this limited-time opportunity to treat yourself to an unforgettable dining experience at our restaurant.",
                    "We take immense pride in this accolade, as it reflects our unwavering dedication to providing an unforgettable dining experience. From the moment you enter, you'll be enveloped in an ambiance that exudes sophistication and class. Our attentive and knowledgeable staff will guide you through an exquisite culinary journey, where every detail has been meticulously curated. The menu is a testament to our commitment to gastronomic excellence, featuring a symphony of flavors that will transport you to culinary bliss. We invite you to savor the creations of our talented chefs, who blend innovation with tradition to craft dishes that are both visually stunning and palate-pleasing. Whether you're celebrating a special occasion, enjoying a romantic dinner, or simply seeking an extraordinary culinary adventure, we invite you to join us at one of the top 5 best restaurants, where exceptional dining experiences become a reality.",
                    "Whether you are a skilled chef, a talented bartender, a knowledgeable sommelier, or a friendly server, we are eager to meet individuals who are dedicated to delivering exceptional service with a smile. We offer competitive compensation, ongoing training, and opportunities for growth within our organization. If you have a passion for hospitality, a commitment to quality, and a desire to be part of a team that strives for excellence, we invite you to apply today. Join us and be part of a restaurant where your talents are valued and your potential is limitless."    
                ]
    }
    console.log(content.image[params.id])
    return (
        <div className='w-full font-serif h-auto py-10 px-20 bg-white rounded-xl items-center flex flex-col justify-start gap-2'>
            <div className='w-auto h-auto font-extrabold text-3xl text-primary font-serif'>
                {content.topic[params.id]}
            </div>
            <div className='text-4xl font-bold  font-serif text-black flex flex-col  gap-1 p-2 text-center'>
                {content.title[params.id]}
            </div>
            <div className='w-auto'>
                <span className='font-bold text-xl text-slate-900'>
                    Writer:{" "}
                </span>
                <span className='font-normal text-xl text-slate-900'>
                    {content.writer[params.id]}
                </span>
            </div>
            <div className='w-auto'>
                <span className='font-bold text-xl text-slate-900'>Date: </span>
                <span className='font-normal text-xl text-slate-900'>
                    {content.publish_date[params.id]}
                </span>
            </div>
            <div className='w-full p-5 text-justify'>
                {content.content_1[params.id]}
            </div>
            <div className='px-60'>
                <Image
                    src={content.image[params.id]}
                    alt={"News"}
                    width={300}
                    height={300}
                    className='w-full h-auto'
                    unoptimized
                />
            </div>
            <div className='w-full p-5 text-justify'>
                {content.content_2[params.id]}
            </div>
        </div>
    );
}
