function Page(options)
{
    this.onInit = function(){};
    this.onBeforeShow = function(){};
    this.onShow = function(){};
    this.onBeforeHide = function(){};
    this.onHide = function(){};
}

function Navigation()
{
    let _nav = this;

    this.pages = {};

    this.addPage = function(name, page){
        _nav.pages[name] = page;
    };

    this.hashNavigate = function() {
        let hash = window.location.hash.substr(1);

        if (! hash) {
            hash = 'home';
        }

        _nav.changePage(hash);
    };

    this.go = function (name) {
        window.location.hash = '#' + name;
    };
    
    this.changePage = function (name) {

        if ($('section.page:visible').length) {
            let toHide = $('section.page:visible').data('page'); 
            console.log(toHide);
            if (toHide in _nav.pages) {
                _nav.pages[toHide].onBeforeHide();
            }

            $('section.page:visible').fadeOut(500, function(){
                $(this).hide();
                if (toHide in _nav.pages) {
                    _nav.pages[toHide].onHide();
                }
                _nav.showPage(name)
            });
        }
        else {
            _nav.showPage(name)
        }
    };

    this.showPage = function(name) {
        let canShow = true;
        
        if (name in _nav.pages) {
            if (_nav.pages[name].onBeforeShow() === false){
                console.log('Can not show');
                canshow = false;
                return;
            }
        }

        if (canShow) {
            $('section.page[data-page=' + name + ']').fadeIn(500, function(){
                if (name in _nav.pages) {
                    _nav.pages[name].onShow();
                }
            });
        }
    };


    $(document).ready(function(){
        $('section.page').removeAttr('style')
                         .fadeOut(0);
    
        for (let page in _nav.pages) {
            console.log(page);
            _nav.pages[page].onInit();
        }
    
        window.onhashchange = _nav.hashNavigate;
        _nav.hashNavigate();
    });
    
}
