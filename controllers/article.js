const Article = require("mongoose").model("Article");

module.exports = {
    createGet: function (req, res) {
        res.render('article/create');
    },
    createPost: function (req, res) {
        const articleArgs = req.body;

        let errMsg = '';
        if (!req.isAuthenticated()){
            errMsg = 'Please log in!';
        }else if (!articleArgs.title){
            errMsg ='Please write title!';
        } else if (!articleArgs.content){
            errMsg = 'Please write some text in the content box!';
        }

        if (errMsg){
            res.render('article/create', {error: errMsg});
            return;
        }

        articleArgs.author = req.user.id;

       Article.create(articleArgs).then(article =>{
           req.user.articles.push(article);
           req.user.save(error =>{
               if (error){
                   res.redirect('/', {error: error.message});
               }else {
                   res.redirect('/');
               }
           });
       });
    },
    details: (req, res)  => {
        let id = req.params.id;

        Article.findById(id).populate('author').then(article =>{
            res.render('article/details', article);
        })
    }
};