"use strict";

const { time } = require("console");
const faker = require("faker");

module.exports = {
    up: async (queryInterface, Sequelize) => {

        const pizza_items = [
            {
                name: "Pizza hải sản",
                description: "Pizza hải sản tươi ngon, phong phú vị biển, kết hợp với sốt cà chua đậm đà, là sự kết hợp hoàn hảo giữa hải sản và phô mai.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711532799/Product/Pizza/photo-1669490883041-2d0ac48bc4c8_qyqsvx.jpg"
            },
            {
                name: "Pizza thịt",
                description: "Pizza thịt thơm ngon, giàu protein, kết hợp với các loại thịt đa dạng như xúc xích, thịt bò, thịt heo, và phô mai, đem lại trải nghiệm ẩm thực đầy đặc sắc.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711532729/Product/Pizza/photo-1574556571217-129608c1b522_acdtvg.jpg"
            },
            {
                name: "Pizza rau củ",
                description: "Pizza rau củ là lựa chọn hoàn hảo cho người ăn chay, kết hợp với các loại rau củ tươi ngon và phô mai, đảm bảo độ bổ dưỡng và ngon miệng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711532666/Product/Pizza/photo-1710917159375-985a60e083d8_zwwyf4.jpg"
            },
            {
                name: "Pizza nấm",
                description: "Pizza nấm thơm ngon, giàu chất dinh dưỡng, kết hợp với phô mai và sốt cà chua, mang lại hương vị đặc trưng và hấp dẫn.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711532593/Product/Pizza/photo-1655673653787-b659d6a0165b_gp63yh.jpg"
            },
            {
                name: "Pizza cừu",
                description: "Pizza cừu thơm ngon, đậm đà, kết hợp với thịt cừu, cà chua, và phô mai, là lựa chọn tuyệt vời cho những ai yêu thích hương vị đặc trưng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711532291/Product/Pizza/photo-1705286324371-d6a6d9519dc2_muvdkk.jpg"
            },
            {
                name: "Pizza hawaii",
                description: "Pizza hawaii thơm ngon, ngọt ngào, kết hợp với dứa, thịt hun khói, và phô mai, mang lại trải nghiệm ẩm thực hòa quyện giữa hương vị đắng, ngọt và mặn.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711532020/Product/Pizza/photo-1711306723422-65b54ca06bec_fmsj9v.jpg"
            },
            {
                name: "Pizza gà",
                description: "Pizza gà thơm ngon, thịt gà mềm mại, kết hợp với rau sống và sốt cà chua, là sự lựa chọn lý tưởng cho bữa ăn gia đình.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711532492/Product/Pizza/photo-1708989175809-150575781da5_nj04ka.jpg"
            },
            {
                name: "Pizza thập cẩm",
                description: "Pizza thập cẩm phong phú, đa dạng hương vị, kết hợp với các loại thịt, rau củ, và phô mai, đem lại trải nghiệm ẩm thực đa chiều.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711532430/Product/Pizza/photo-1670338512239-556181fff224_qqvjke.jpg"
            },
            {
                name: "Pizza pepperoni",
                description: "Pizza pepperoni thơm ngon, mỡng mạnh, kết hợp với cà chua, phô mai và ớt chuông, mang lại hương vị cay nồng đặc trưng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711532369/Product/Pizza/photo-1703575571328-707946c04cc4_c0defu.jpg"
            },
            {
                name: "Pizza thanh cua",
                description: "Pizza thanh cua thơm ngon, ngọt ngào, kết hợp với thịt cua, cà chua, và phô mai, đem lại hương vị biển ngọt và đặc trưng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711532299/Product/Pizza/photo-1708782281091-35e23ab54a64_ar0dcy.jpg"
            }
        ];

        const drink_items = [
            {
                name: "Cà phê đen",
                description: "Cà phê đen thơm ngon, đậm đà, là sự kết hợp hoàn hảo giữa hạt cà phê chất lượng cao và nước nóng, đem lại cảm giác tỉnh táo và sảng khoái.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533220/Product/Drink/photo-1708782343412-787fade27b60_sbbdon.jpg"
            },
            {
                name: "Trà sữa matcha",
                description: "Trà sữa matcha thơm ngon, béo ngậy, là sự kết hợp tinh tế giữa trà matcha Nhật Bản và sữa tươi, mang lại hương vị đặc trưng và bổ dưỡng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533194/Product/Drink/photo-1708799281112-5ec2b44a7c98_gx6xkz.jpg"
            },
            {
                name: "Sinh tố trái cây",
                description: "Sinh tố trái cây tươi ngon, giàu vitamin, là sự pha trộn hài hòa giữa các loại trái cây tươi ngon như chuối, dâu, và cam, mang lại cảm giác sảng khoái và bổ dưỡng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533169/Product/Drink/photo-1709003995898-ca69b07a8ef3_hndtnr.jpg"
            },
            {
                name: "Nước dừa",
                description: "Nước dừa tươi ngon, giàu khoáng chất, là lựa chọn tuyệt vời cho một ngày nắng nóng, mang lại cảm giác mát lạnh và bổ dưỡng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533120/Product/Drink/photo-1710732495871-a1eb665728c1_wv9pt2.jpg"
            },
            {
                name: "Nước ép cà rốt",
                description: "Nước ép cà rốt tươi ngon, giàu vitamin A, là lựa chọn khỏe mạnh cho một ngày mới tràn đầy năng lượng, mang lại cảm giác sảng khoái và bổ dưỡng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533091/Product/Drink/photo-1711408999436-489d07b1276f_oaijv9.jpg"
            },
            {
                name: "Soda chanh",
                description: "Soda chanh thơm ngon, sảng khoái, là sự kết hợp tuyệt vời giữa nước soda lạnh và nước chanh tươi, mang lại cảm giác sảng khoái và ngon miệng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533063/Product/Drink/photo-1710880693051-5fd8c21bb943_tns6d1.jpg"
            },
            {
                name: "Nước cam ép",
                description: "Nước cam ép tươi ngon, giàu vitamin C, là lựa chọn tốt cho sức khỏe tim mạch và làm đẹp da, mang lại cảm giác sảng khoái và bổ dưỡng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711532996/Product/Drink/photo-1711185896093-460428ace516_ale6z2.jpg"
            },
            {
                name: "Cà phê sữa đá",
                description: "Cà phê sữa đá thơm ngon, ngọt ngào, là sự kết hợp hài hòa giữa cà phê đen đậm đà và sữa đặc ngọt ngào, mang lại cảm giác tỉnh táo và sảng khoái.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711532961/Product/Drink/photo-1711409157292-19a93d785b6e_i4lirk.jpg"
            },
            {
                name: "Nước ngọt cola",
                description: "Nước ngọt cola thơm ngon, đậm đà, là lựa chọn phổ biến cho mọi dịp vui chơi và gặp gỡ bạn bè, mang lại cảm giác sảng khoái và ngon miệng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711532934/Product/Drink/photo-1710975003023-25fdf143226a_ivvwje.jpg"
            },
            {
                name: "Nước cam tươi",
                description: "Nước cam tươi ngon, giàu vitamin C, là lựa chọn khỏe mạnh cho một ngày mới tràn đầy năng lượng, mang lại cảm giác sảng khoái và bổ dưỡng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711532909/Product/Drink/photo-1711335792535-acacf1727eab_msr32u.jpg"
            }
        ];
        

        const fruit_items = [
            {
                name: "Dâu tây",
                description: "Dâu tây tươi ngon, giàu vitamin C, là loại trái cây chứa nhiều chất chống oxy hóa, tốt cho sức khỏe tim mạch và làm đẹp da.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533984/Product/Fruit/photo-1709267846209-81936b7441bb_na3d8u.jpg"
            },
            {
                name: "Lê",
                description: "Lê tươi ngon, giàu chất xơ và vitamin, giúp cải thiện hệ tiêu hóa và tăng cường hệ miễn dịch, là lựa chọn tốt cho sức khỏe và vẻ đẹp.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533859/Product/Fruit/photo-1708759284723-9fbd459939b4_q47cos.jpg"
            },
            {
                name: "Cherry",
                description: "Cherry tươi ngon, giàu chất chống oxy hóa và vitamin C, giúp cải thiện trí não và làm đẹp da, là lựa chọn tuyệt vời cho sức khỏe và vẻ đẹp.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533763/Product/Fruit/photo-1709719263426-861bb35bbd0c_zy4nki.jpg"
            },
            {
                name: "Xoài",
                description: "Xoài tươi ngon, giàu vitamin A và C, giúp cải thiện hệ miễn dịch và làm đẹp da, là lựa chọn tốt cho sức khỏe và vẻ đẹp.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533736/Product/Fruit/photo-1711232346726-1fdd9ff567b0_lpfvmc.jpg"
            },
            {
                name: "Cam",
                description: "Cam tươi ngon, giàu vitamin C, là lựa chọn tốt cho sức khỏe tim mạch và làm đẹp da, mang lại cảm giác sảng khoái và bổ dưỡng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533650/Product/Fruit/photo-1710578958292-d065d3b4abcb_o0upkg.jpg"
            },
            {
                name: "Nho",
                description: "Nho tươi ngon, giàu chất chống oxy hóa và chất xơ, giúp cải thiện sức khỏe tim mạch và hệ tiêu hóa, là lựa chọn tốt cho sức khỏe và vẻ đẹp.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533581/Product/Fruit/photo-1710793231486-6ff1bc099a5d_kqav8f.jpg"
            },
            {
                name: "Dứa",
                description: "Dứa tươi ngon, giàu enzyme và chất chống oxy hóa, giúp cải thiện hệ tiêu hóa và làm đẹp da, là lựa chọn tốt cho sức khỏe và vẻ đẹp.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533480/Product/Fruit/photo-1710971695594-cf9095516a37_xxd9kw.jpg"
            },
            {
                name: "Dừa",
                description: "Dừa tươi ngon, giàu khoáng chất và chất xơ, giúp cải thiện sức khỏe tim mạch và hệ tiêu hóa, mang lại cảm giác mát lạnh và bổ dưỡng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533407/Product/Fruit/photo-1710444223962-a18f0de17a24_f0jtpr.jpg"
            },
            {
                name: "Bơ",
                description: "Bơ tươi ngon, giàu chất béo không bão hòa và vitamin E, giúp cải thiện chất lượng da và hệ miễn dịch, là lựa chọn tốt cho sức khỏe và vẻ đẹp.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533365/Product/Fruit/photo-1485293992701-967314a7c495_vsb5fi.jpg"
            },
            {
                name: "Ổi",
                description: "Ổi tươi ngon, giàu chất chống oxy hóa và chất xơ, giúp cải thiện hệ tiêu hóa và hệ miễn dịch, là lựa chọn tốt cho sức khỏe và vẻ đẹp.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533333/Product/Fruit/photo-1629567971554-0cc0883dd57b_kyr6rd.jpg"
            }
        ];


        const hotdog_items = [
            {
                name: "Hotdog gà",
                description: "Hotdog gà thơm ngon, thịt gà mềm mại, kết hợp với sốt mayonnaise, cà chua, và ớt chuông, là món ăn vặt hấp dẫn cho mọi lứa tuổi.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534866/Product/Hotdog/photo-1694849218335-6cd9837bf75a_hf7bfd.jpg"
            },
            {
                name: "Hotdog bò",
                description: "Hotdog bò thơm ngon, đậm đà, thịt bò xay mềm mại, kết hợp với sốt cà chua, ớt chuông và hành tây, là lựa chọn hoàn hảo cho bữa ăn nhanh ngon miệng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534827/Product/Hotdog/photo-1612392167062-8f76710986ba_he62f4.jpg"
            },
            {
                name: "Hotdog heo",
                description: "Hotdog heo thơm ngon, giàu dinh dưỡng, thịt heo xay mềm mại, kết hợp với sốt BBQ, dưa leo, và hành phi, là sự kết hợp hoàn hảo giữa ngọt ngào và đậm đà.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534796/Product/Hotdog/photo-1496905583330-eb54c7e5915a_klmin1.jpg"
            },
            {
                name: "Hotdog cá",
                description: "Hotdog cá thơm ngon, tươi ngon, cá hấp dẫn kết hợp với sốt tartar, cà chua, và rau sống, đem lại hương vị biển tươi mát và đầy hấp dẫn.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534740/Product/Hotdog/photo-1612392061787-2d078b3e573c_iancsi.jpg"
            },
            {
                name: "Hotdog thanh cua",
                description: "Hotdog thanh cua thơm ngon, đậm đà, thịt cua tươi ngon, kết hợp với sốt mayonnaise, dưa leo và hành tây, mang lại hương vị biển ngọt và béo ngậy.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534695/Product/Hotdog/photo-1619740455993-9e612b1af08a_yjftgz.jpg"
            },
            {
                name: "Hotdog trứng",
                description: "Hotdog trứng thơm ngon, giàu protein, kết hợp với trứng chiên, sốt mayonnaise, và rau sống, là lựa chọn hoàn hảo cho bữa ăn sáng đầy dinh dưỡng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534658/Product/Hotdog/photo-1541151040323-4d766525ec84_tnkzwc.jpg"
            },
            {
                name: "Hotdog cà chua",
                description: "Hotdog cà chua thơm ngon, giàu vitamin, kết hợp với cà chua, hành tây, và sốt mayonnaise, là món ăn vặt yêu thích của nhiều người.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534639/Product/Hotdog/photo-1563567644743-81256d4aedca_wqribh.jpg"
            },
            {
                name: "Hotdog ốc quế",
                description: "Hotdog ốc quế thơm ngon, đậm đà, kết hợp với ốc quế, sốt BBQ, và rau sống, mang lại hương vị đặc trưng và hấp dẫn của đất nước Mỹ.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534624/Product/Hotdog/photo-1619538189125-78e1be692487_zviguw.jpg"
            },
            {
                name: "Hotdog chả cá",
                description: "Hotdog chả cá thơm ngon, đậm đà, chả cá tươi ngon kết hợp với sốt tartar, dưa leo và hành phi, là món ăn đặc sản của vùng biển Việt Nam.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534605/Product/Hotdog/photo-1605153722912-f3359f0bbc52_ozftzv.jpg"
            },
            {
                name: "Hotdog trứng cút",
                description: "Hotdog trứng cút thơm ngon, đậm đà, kết hợp với trứng cút chiên và sốt mayonnaise, mang lại hương vị độc đáo và đầy hấp dẫn.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534562/Product/Hotdog/photo-1627054248949-21f77275a15f_guz8s1.jpg"
            }
        ];


        const snack_items = [
            {
                name: "Khoai tây chiên",
                description: "Khoai tây chiên giòn và thơm ngon",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711535985/Product/Snack/photo-1708818296712-dede4ec86051_dzulag.jpg"
            },
            {
                name: "Bánh snack hình thú",
                description: "Bánh snack hình thú ngon và bổ dưỡng",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534442/Product/Snack/FIRSTSnacksAsDaypart_1_ht9wdt.jpg"
            },
            {
                name: "Bánh quy hạnh nhân",
                description: "Bánh quy hạnh nhân thơm ngon và giòn tan",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534432/Product/Snack/photo-1530805948738-95aa20739233_ls18oa.jpg"
            },
            {
                name: "Bánh quy hình ngôi nhà",
                description: "Bánh quy hình ngôi nhà đáng yêu và thơm ngon",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534310/Product/Snack/photo-1705297281833-ed8d77e0ede4_puwqkb.jpg"
            },
            {
                name: "Bánh tráng trộn",
                description: "Bánh tráng trộn với hương vị đặc biệt và lạ miệng",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534062/Product/Snack/photo-1710686698863-e6bd5c03987a_a1m2uv.jpg"
            },
            {
                name: "Bánh snack nho khô",
                description: "Bánh snack nho khô bổ dưỡng và ngon miệng",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534021/Product/Snack/photo-1705868454777-4d1d730acee2_orowhj.jpg"
            },
            {
                name: "Bánh snack hình ngôi sao",
                description: "Bánh snack hình ngôi sao thơm ngon và đẹp mắt",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534005/Product/Snack/photo-1705868465635-7bf0a43bf911_zgwymz.jpg"
            },
            {
                name: "Gói snack hỗn hợp",
                description: "Gói snack hỗn hợp với nhiều loại hương vị đa dạng",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533953/Product/Snack/photo-1708002011308-4881f6792546_fpqcu7.jpg"
            },
            {
                name: "Bánh bơ sữa",
                description: "Bánh bơ sữa thơm ngon và giàu dinh dưỡng",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533870/Product/Snack/photo-1710954092666-cec65a1a6e5e_ljvyyj.jpg"
            },
            {
                name: "Bánh cookie chocolate",
                description: "Bánh cookie chocolate đầy hấp dẫn và thơm ngon",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533827/Product/Snack/photo-1708746333842-b811e0bf6c05_ovz4gi.jpg"
            }
        ];
        
        const burger_items = [
            {
                name: "Burger phô mai",
                description: "Burger phô mai thơm ngon, béo ngậy, kết hợp với phô mai tan chảy, là một lựa chọn tuyệt vời cho bữa ăn nhanh.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533584/Product/Burger/photo-1703575571931-5f6479564ac6_vcm1ed.jpg"
            },
            {
                name: "Burger bò",
                description: "Burger bò thơm ngon, thịt bò mềm mại, kết hợp với rau sống và sốt ngọt cay, hấp dẫn từng miếng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533566/Product/Burger/photo-1703575571976-94661cb85392_zxqmqd.jpg"
            },
            {
                name: "Burger gà",
                description: "Burger gà thơm ngon, thịt gà giòn tan, kết hợp với rau sống và sốt kem, mang lại trải nghiệm mới lạ.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533540/Product/Burger/photo-1705131186176-1c7cdb830815_hcssly.jpg"
            },
            {
                name: "Burger hải sản",
                description: "Burger hải sản tươi ngon, phong phú vị biển, kết hợp với rau sống và sốt mayonnaise, đem đến hương vị đặc biệt.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533449/Product/Burger/photo-1708989176600-292d49d45e99_i3sbey.jpg"
            },
            {
                name: "Burger rau củ",
                description: "Burger rau củ là lựa chọn hoàn hảo cho người ăn chay, kết hợp với rau sống và sốt dầu hạt, đảm bảo sự bổ dưỡng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533432/Product/Burger/photo-1705131187598-771f00b7712c_m3i0ya.jpg"
            },
            {
                name: "Burger nấm",
                description: "Burger nấm thơm ngon, giàu chất dinh dưỡng, kết hợp với rau sống và sốt tiêu đen, mang lại trải nghiệm ẩm thực mới mẻ.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533408/Product/Burger/photo-1705131186384-892e65a00ba7_x8upp4.jpg"
            },
            {
                name: "Burger cơm",
                description: "Burger cơm đậm đà, thơm ngon, kết hợp với rau sống và sốt mật ong, là lựa chọn tiết kiệm và ngon miệng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533313/Product/Burger/photo-1705484804594-223195a4cce4_q7pbpo.jpg"
            },
            {
                name: "Burger thịt heo",
                description: "Burger thịt heo ngon mềm, kết hợp với rau sống và sốt barbecue, mang lại hương vị đậm đà và hấp dẫn.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533286/Product/Burger/photo-1708076158453-ad7346b6d2a0_hgvg0f.jpg"
            },
            {
                name: "Burger trứng",
                description: "Burger trứng thơm ngon, giàu protein, kết hợp với rau sống và sốt mayonnaise, là món ăn sáng hoàn hảo.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533246/Product/Burger/photo-1708989177075-9e416e70d8ea_ymyxgs.jpg"
            },
            {
                name: "Burger bánh mỳ",
                description: "Burger bánh mỳ thơm ngon, đặc biệt, kết hợp với rau sống và sốt mù tạt, mang lại trải nghiệm ẩm thực đa dạng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533202/Product/Burger/photo-1708782340491-55cd667653df_bkvzz0.jpg"
            },
            {
                name: "Burger cừu",
                description: "Burger cừu thơm ngon, đậm đà, kết hợp với rau sống và sốt dầu ớt, mang lại hương vị đặc trưng của thịt cừu.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711533185/Product/Burger/photo-1709403541977-042ae443a378_dpyrsr.jpg"
            }
        ];

        const veggie_items =  [
            {
                name: "Salad bắp cải",
                description: "Rau cải bắp cải tươi ngon, giàu dinh dưỡng và phong phú vitamin.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534514/Product/Veggie/photo-1625944230945-1b7dd3b949ab_qxe715.jpg"
            },
            {
                name: "Salad cải xanh",
                description: "Rau cải xanh tươi mát, là nguồn cung cấp chất xơ và vitamin cho bữa ăn hằng ngày.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534454/Product/Veggie/photo-1518779578993-ec3579fee39f_kddc81.jpg"
            },
            {
                name: "Salad cải chua",
                description: "Rau cải chua giòn giòn, hương vị đặc trưng, thích hợp cho các món canh chua.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534399/Product/Veggie/photo-1648437595604-f1794490053c_bj4u87.jpg"
            },
            {
                name: "Salad rau diếp",
                description: "Rau diếp xanh tươi sạch, giàu vitamin K và axít folic, tốt cho sức khỏe tim mạch.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534333/Product/Veggie/photo-1558736119-77819403c711_ljddvi.jpg"
            },
            {
                name: "Salad rau mầm",
                description: "Rau mầm tươi mát, giàu chất chống ô xy hóa và chất dinh dưỡng cần thiết cho cơ thể.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534308/Product/Veggie/photo-1609690963718-0b55905aef78_lsokze.jpg"
            },
            {
                name: "Salad cà chua",
                description: "Cà chua chín đỏ mọng, là nguồn cung cấp lycopene, giúp bảo vệ tim và phòng chống ung thư.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534254/Product/Veggie/photo-1677653805080-59c57727c84e_ujkdeh.jpg"
            },
            {
                name: "Salad dưa leo",
                description: "Dưa leo tươi mát, giàu nước và chất chống oxi hóa, giúp làm mát cơ thể và cung cấp năng lượng.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534224/Product/Veggie/photo-1518779578993-ec3579fee39f_kc1caw.jpg"
            },
            {
                name: "Salad bí đỏ",
                description: "Bí đỏ giàu beta-carotene, tốt cho thị lực và hệ miễn dịch, là lựa chọn lý tưởng cho món nướng hay hầm.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534192/Product/Veggie/photo-1629145400374-e99188d4443b_hhodrf.jpg"
            },
            {
                name: "Salad cà rốt",
                description: "Cà rốt giàu vitamin A và beta-carotene, giúp cải thiện sức khỏe da và tăng cường hệ miễn dịch.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534134/Product/Veggie/photo-1533606117812-0783e8e690f1_hoafsh.jpg"
            },
            {
                name: "Salad hành tây",
                description: "Hành tây thơm ngon, giàu chất chống vi khuẩn và chất chống viêm, tốt cho hệ tiêu hóa và kháng khuẩn.",
                thumbnail: "https://res.cloudinary.com/djdpobmlv/image/upload/v1711534119/Product/Veggie/photo-1627279001674-4c7dbd9edb88_xuj7rs.jpg"
            }
        ];
        


        const products_pizza = pizza_items.map((pizza) =>    ( {
            name: pizza.name,
            description: pizza.description,
            price: faker.random.number({ min: 50000, max: 90000,  precision: 5000  }),
            thumbnails: pizza.thumbnail,
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        }))

        const products_drink = drink_items.map((pizza) =>    ( {
            name: pizza.name,
            description: pizza.description,
            price: faker.random.number({ min: 30000, max: 60000,  precision: 5000  }),
            thumbnails: pizza.thumbnail,
            categoryId: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
        }))

        const products_fruit = fruit_items.map((pizza) =>    ( {
            name: pizza.name,
            description: pizza.description,
            price: faker.random.number({ min: 40000, max: 80000,  precision: 5000  }),
            thumbnails: pizza.thumbnail,
            categoryId: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
        }))

        const products_hotdog = hotdog_items.map((pizza) =>    ( {
            name: pizza.name,
            description: pizza.description,
            price: faker.random.number({ min: 40000, max: 80000,  precision: 5000  }),
            thumbnails: pizza.thumbnail,
            categoryId: 4,
            createdAt: new Date(),
            updatedAt: new Date(),
        }))

        const products_snack = snack_items.map((pizza) =>    ( {
            name: pizza.name,
            description: pizza.description,
            price: faker.random.number({ min: 40000, max: 80000,  precision: 5000  }),
            thumbnails: pizza.thumbnail,
            categoryId: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
        }))

        const products_burger = burger_items.map((pizza) =>    ( {
            name: pizza.name,
            description: pizza.description,
            price: faker.random.number({ min: 40000, max: 80000,  precision: 5000  }),
            thumbnails: pizza.thumbnail,
            categoryId: 6,
            createdAt: new Date(),
            updatedAt: new Date(),
        }))


        const products_veggie = veggie_items.map((pizza) =>    ( {
            name: pizza.name,
            description: pizza.description,
            price: faker.random.number({ min: 40000, max: 80000,  precision: 5000  }),
            thumbnails: pizza.thumbnail,
            categoryId: 7,
            createdAt: new Date(),
            updatedAt: new Date(),
        }))

        const products = [...products_drink, ...products_burger, ...products_fruit, ...products_pizza, ...products_hotdog, ...products_snack, ...products_veggie]


        const floors = [
            {
                name: "1st",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "2nd",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]

        const tables = [
            {
                name: "N/A",
                status: "Free",
                numRes: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T1",
                status: "Free",
                numRes: 1,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T2",
                status: "Free",
                numRes: 0,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T3",
                status: "Occupied",
                numRes: 0,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T4",
                status: "Occupied",
                numRes: 0,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T5",
                status: "Free",
                numRes: 2,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T6",
                status: "Free",
                numRes: 0,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T7",
                status: "Free",
                numRes: 0,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T8",
                status: "Free",
                numRes: 0,
                floorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T9",
                status: "Free",
                numRes: 2,
                floorId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T10",
                status: "Occupied",
                numRes: 0,
                floorId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T11",
                status: "Free",
                numRes: 0,
                floorId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "T12",
                status: "Free",
                numRes: 0,
                floorId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]

        const reservations = [
            {
                customerCount: 3,
                customerName: "Luong Nguyen",
                customerPhone: "0123456789",
                status: "Waiting",
                dateTo:  new Date("2024-04-20"),
                timeTo: "15:00",
                timeEnd: "17:00",
                description: "",
                createdAt: new Date(2024,3,19),
                updatedAt: new Date(2024,3,19),

            },
            {
                customerCount: 4,
                customerName: "Hung Nguyen",
                customerPhone: "0323456788",
                status: "Done",
                dateTo:  new Date("2024-03-15"),
                timeTo: "15:00",
                timeEnd: "17:00",
                description: "",
                createdAt: new Date(2024,3,10),
                updatedAt: new Date(2024,3,10),

            },
            {
                customerCount: 2,
                customerName: "Vuong Lieu",
                customerPhone: "0223456798",
                status: "Canceled",
                dateTo:  new Date("2024-03-14"),
                timeTo: "07:00",
                timeEnd: "09:00",
                description: "",
                createdAt: new Date(2024,3,5),
                updatedAt: new Date(2024,3,5),

            },
            {
                customerCount: 2,
                customerName: "Tony Le",
                customerPhone: "0423456798",
                status: "Waiting",
                dateTo:  new Date("2024-03-19"),
                timeTo: "07:00",
                timeEnd: "10:00",
                description: "",
                createdAt: new Date(2024,3,12),
                updatedAt: new Date(2024,3,12),

            },
            {
                customerCount: 2,
                customerName: "Dung Tran",
                customerPhone: "0443456798",
                status: "Waiting",
                dateTo:  new Date("2024-04-20"),
                timeTo: "08:00",
                timeEnd: "11:00",
                description: "",
                createdAt: new Date(2024,3,15),
                updatedAt: new Date(2024,3,25),

            },
        ]

        const table_reservations = [
            {
                tableId: 2,
                reservationId: 1
            },
            {
                tableId: 3,
                reservationId: 2
            },
            {
                tableId: 4,
                reservationId: 3
            },
            {
                tableId: 6,
                reservationId: 4
            },
            {
                tableId: 10,
                reservationId: 4
            },
            {
                tableId: 6,
                reservationId: 5
            },
            {
                tableId: 10,
                reservationId: 5
            },
        ]

        await queryInterface.bulkInsert("Products", products);
        await queryInterface.bulkInsert("Floors", floors);
        await queryInterface.bulkInsert("Tables", tables);
        await queryInterface.bulkInsert("Reservations", reservations);
        await queryInterface.bulkInsert("TableReservations", table_reservations);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Floors", null, {});
    },
};