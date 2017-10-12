var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");

// DB FLUSHING FUNCTION
function yelpCampDbReset(){
    //TODO: flush comments collection
    Campground.remove({}, function(err){
        if(err){
            console.log("DATABASE FLUSH ERROR: ");
            console.log(err);
            return 0;
        } else {
            console.log("DATABASE FLUSHED!");
            var sampleData = [
                {   name:"Salmon Creek",
                    image: "https://farm4.staticflickr.com/3742/10759552364_a796a5560a.jpg",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed egestas pulvinar massa eu vestibulum. Nunc fermentum mattis nunc, ut laoreet ante bibendum ut. Vivamus id ligula nec tellus interdum mollis sed in velit. Sed sollicitudin porta orci sit amet maximus. Donec at placerat nisl. Aenean laoreet interdum ante vel tincidunt. Cras consequat bibendum imperdiet. Nunc sed nibh leo. Suspendisse eros arcu, condimentum at tempus at, hendrerit in nulla. Donec volutpat augue at tincidunt ullamcorper. Vestibulum volutpat turpis non massa bibendum, ut lobortis orci molestie. Donec nisi augue, accumsan quis dui vel, lobortis hendrerit diam. Integer vel congue nulla. Aenean sit amet hendrerit mi. In varius tempus felis, vel egestas tellus gravida eu.\n\nMaecenas consectetur libero nec orci placerat, eget tristique quam consequat. Donec et accumsan lacus. Vestibulum venenatis urna est, porta malesuada risus posuere at. Nunc a enim vel velit pulvinar tristique et at nisl. Aenean mattis sagittis tempor. Vivamus rutrum tellus velit, sit amet volutpat nunc congue ac. Nulla at vulputate neque, nec sagittis nibh.\n\nNunc suscipit tortor sit amet risus dictum auctor. Aliquam fermentum viverra ultrices. Nam sit amet dolor et erat eleifend blandit. Praesent non arcu euismod justo commodo imperdiet ac fringilla diam. Proin sodales fringilla egestas. Maecenas vitae ultrices dui. In porta diam eget dui convallis posuere. Ut lacinia ex et lacus ultricies, eget elementum odio laoreet. Suspendisse eleifend varius tortor at fermentum. In hac habitasse platea dictumst. Ut maximus, libero nec malesuada hendrerit, quam enim lacinia quam, et tristique libero quam non quam. Nam tincidunt vestibulum est nec placerat. Morbi consectetur commodo cursus. Nam metus dolor, rutrum nec viverra vitae, pulvinar eget orci."
                },
                {
                    name:"Granite Hill",
                    image: "https://farm1.staticflickr.com/22/31733208_3190a1e982.jpg",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget varius arcu. Duis id nibh elementum, imperdiet risus vulputate, vehicula diam. Morbi sodales magna at dolor aliquam tempus. Mauris suscipit enim vitae placerat tincidunt. Ut condimentum nulla magna, ut pharetra orci varius bibendum. Etiam efficitur dignissim quam, vel blandit lectus vestibulum at. Praesent dui dolor, rhoncus sit amet ipsum ac, condimentum aliquet velit.\n\nSuspendisse scelerisque eu erat sed vehicula. Maecenas porttitor ante euismod mauris egestas, tempor lobortis metus tincidunt. Sed vehicula leo et elit lacinia convallis. Aliquam sagittis est at justo faucibus, ac lacinia mi semper. Maecenas tempus dolor vel ornare sagittis. Integer bibendum tortor non turpis maximus condimentum. Phasellus euismod non magna sed sagittis. Proin posuere sodales erat ut tempus. Sed non quam nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin sit amet lacus sem. Curabitur diam nisl, vulputate eget venenatis nec, egestas eu risus. Morbi in bibendum urna. Morbi et aliquet nisl, et ullamcorper lectus. Donec id massa lectus. Aliquam erat volutpat.\n\nInteger interdum purus in turpis posuere, eget accumsan erat pellentesque. Nullam sit amet ex quis odio lacinia pellentesque ac at felis. Praesent at velit non tortor semper euismod sed ut erat. Sed lobortis volutpat aliquam. Duis vel tortor eget arcu egestas posuere nec ut lorem. In ullamcorper ultricies ipsum eu lobortis. Suspendisse potenti. Nulla elementum, urna non lobortis tincidunt, mi nibh ultricies massa, non mollis quam tellus quis odio. Nulla facilisi. Phasellus non magna lectus. Nulla vehicula felis velit, a consectetur dolor eleifend id."
                },
                {
                    name:"Mountain Goat's Rest",
                    image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dignissim, orci pretium lacinia lacinia, lectus enim placerat eros, a luctus mi ipsum in lacus. Vivamus varius massa ut neque ultrices, at porta ipsum tempor. Donec egestas, erat ac sodales rutrum, magna nibh eleifend diam, vel viverra lorem orci a sem. Phasellus venenatis lobortis arcu at scelerisque. Pellentesque accumsan, nisl eu convallis fringilla, nunc purus lacinia turpis, euismod dictum tortor lorem ac leo. In quis vestibulum est. Sed tellus ante, venenatis condimentum sollicitudin sit amet, pretium in augue. Pellentesque at aliquet lacus. Vivamus ornare mi vitae erat viverra, ut ornare augue rhoncus. Nullam eget commodo tellus, non finibus augue. Fusce augue nibh, interdum non porta vitae, scelerisque quis orci. Nullam sed turpis massa. Praesent rhoncus ante et varius vulputate.\n\nIn hac habitasse platea dictumst. Aenean accumsan urna ac odio aliquet pharetra. Ut quis ullamcorper tortor. Praesent consectetur cursus justo, ut ornare neque maximus non. Nullam sed lectus sed enim lobortis euismod. Nullam convallis sapien neque, sit amet cursus tellus ornare nec. Phasellus urna tellus, ornare vel turpis ac, vehicula egestas sem. Sed iaculis dui tempus aliquet tempor. Vestibulum cursus aliquam erat vel porttitor. Etiam laoreet viverra justo, ac convallis mi tempus in. Vestibulum scelerisque vel tellus eu gravida. Pellentesque tellus sapien, sollicitudin suscipit metus in, auctor tristique felis. Suspendisse convallis, ante in fringilla auctor, lacus nulla porttitor nunc, ac lobortis diam justo ut lacus. Pellentesque feugiat ipsum eget mauris blandit blandit. Cras tincidunt neque dolor, in euismod nibh tincidunt sit amet. Fusce sit amet nunc diam.\n\nMauris commodo ullamcorper purus id sagittis. Duis tincidunt, metus in auctor ultricies, lacus nunc fringilla tellus, sit amet semper tortor sapien sed metus. Pellentesque fringilla tincidunt justo, et convallis leo pulvinar at. Suspendisse arcu mauris, posuere a risus eget, eleifend malesuada ligula. Ut vestibulum augue a dignissim ultrices. Vestibulum sodales quis arcu vel ultricies. Quisque mattis purus in augue pharetra, ut commodo quam auctor. Mauris laoreet maximus eros id ullamcorper. Integer pulvinar lacinia augue, quis elementum sapien vehicula ac. Suspendisse nibh risus, consectetur et sapien in, elementum venenatis enim. Quisque vitae interdum libero. Maecenas molestie nibh lorem, nec tempus nisi cursus ac. Mauris lacinia purus ac justo dignissim, ac pretium odio vestibulum. Vestibulum vulputate turpis nec ex tincidunt euismod. Mauris malesuada, ex eget laoreet ullamcorper, est nisl facilisis urna, sed mattis ligula ipsum a justo. Nullam placerat turpis ipsum, in pulvinar enim scelerisque non."
                }
            ];
            sampleData.forEach(function(sample){
                Campground.create(sample, function(err, campground){
                    if(err){
                        console.log("Sample creation error: ");
                        console.log(err);
                    } else {
                        // console.log("campground sample added");
                        Comment.create({
                            text: "This place is great",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log("Comment creation error: ");
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                // console.log("new comment created");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = yelpCampDbReset;