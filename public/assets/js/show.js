$(function(){
// ----- クラス定義 -----
var ClickCounter = (function(){
    // コンストラクタ
    function ClickCounter(obj, event, api_url){
        this.initialized(obj, event, api_url);
        this.listener();
    }
    
    // 変数初期化
    ClickCounter.prototype.initialized = function(obj, event, api_url){
        this.alredy_count = false;
        this.$target      = $(obj);
        this.event        = event;
        this.api          = {
            url:  api_url, 
            data: this.$target.data("id")
        };
    }
    
    // イベント監視
    ClickCounter.prototype.listener = function(){
        var self = this;
        this.$target.on(this.event, function(){
            self.count(this);
        });
    }
    
    // API 叩いて回数をカウント
    ClickCounter.prototype.count = function(){
        if(this.alredy_count) return 0;
        this.alredy_count = true;
        $.get(this.api.url, {id: this.api.data});
    }
    
    return ClickCounter;
})();

/* ダウンロードカウンタ */
var DlCounter = (function(){
    var DlCounter = function(obj){
        ClickCounter.call(this, obj, 'click', 'dl_count');
    }
    return DlCounter;
})();

/* 再生数カウンタ */
var PlayCounter = (function(){
   var PlayCounter = function(obj){
       ClickCounter.call(this, obj, 'play', 'play_count');
   }
   return PlayCounter;
})();

/* カウンタクラス継承 */
Object.setPrototypeOf(DlCounter.prototype,   ClickCounter.prototype);
Object.setPrototypeOf(PlayCounter.prototype, ClickCounter.prototype);


// ------ インスタンス化 ---------
$(".downloads a").each(function(){
    new DlCounter(this);
});

$(".audio").each(function(){
    new PlayCounter(this); 
});

// ----- クラス定義 --------
var Comment = (function(){
    // コンストラクタ
    function Comment(obj){
        this.initialized(obj);
        this.listener();
    }
    
    // 変数初期化
    Comment.prototype.initialized = function(obj){
        this.$target       = $(obj);
        this.$sound_dom    = $("#sound-id-" + this.$target.data("id"));
        this.$comment_form = this.$sound_dom.find(".comment_form");
        this.data_id       = this.$target.data("id");
        this.user_id       = this.get_cookie("user_id");
        
        // コメント数取得
        var self = this;
        $.get('get_comment_count', {data_id: this.data_id}, function(data){
            self.comment_count = data;
        });
    }
    
    // イベントリスナー
    Comment.prototype.listener = function(){
        var self = this;
        
        // ctrl + enter が押されたらコメント送信
        this.$comment_form.on('keyup', function(e){
            if( e.ctrlKey && e.keyCode == 13) self.$target.trigger('click');
        });
        
        // コメントが送信された時の処理
        this.$target.on('click', function(){
            if( !self.$target.hasClass("disabled") ){
                self.send_message(self.$comment_form.val()); 
                self.show_comment(self.$comment_form.val());
                self.$comment_form.val("");
            }
        });
    }
    
    // コメント送信
    Comment.prototype.send_message = function(comment){
        $.get('send_comment', {
            comment: comment,
            data_id: this.data_id,
            user_id: this.user_id
        });
    }
    
    // コメント表示
    Comment.prototype.show_comment = function(comment){
        var comment       = '<p class="comment_text">' + comment + '</p>';
        if( this.comment_count < 3 ) this.$sound_dom.find(".comments").append(comment);
        else                         this.$sound_dom.find(".show_comment_button").prev().after(comment);
    }
    
    // クッキー取得
    Comment.prototype.get_cookie = function(key){
        var cookies = document.cookie.split(";");
        for( var i=0 ; cookies.length ; i++ ){
            if( cookies[i].substr(0,key.length) == key ) return cookies[i].split("=")[1];
        }
        return null;
    }
    
    return Comment;
})();


// ------ インスタンス化 ------
$(".comment_submit").each(function(){
    new Comment(this);
});

// ------ クラス定義 -------
var Validate = (function(){
    // コンストラクタ
    function Validate(target){
        this.initialized(target);
        this.listener();
    }
    
    // 変数初期化
    Validate.prototype.initialized = function(target){
        this.$target    = $(target);
        this.$sound_dom = $("#sound-id-" + this.$target.data("id"));
        this.$submit    = this.$sound_dom.find(".comment_submit");
        this.data_id    = this.$target.data("id");
        
        // バリデーションパターン
        this.validates  = {
            empty: "",
            space: /( |　)/
        }
    }
    
    // イベントリスナー
    Validate.prototype.listener = function(){
        var self = this;
        
        // フォーカスあたったらバリデーション発火
        this.$target.on('focus', function(){
           self.$target.trigger('keyup'); 
        });
        
        // フォーカス外れたらフォームの縁を元の色に戻す
        this.$target.on('focusout', function(){
           self.$target.parent().removeClass("has-error"); 
        });
        
        // キーが上がったらバリデーション実行
        this.$target.on('keyup', function(){
            self.check();
        });
    }
    
    // 全てのバリデーション実行
    Validate.prototype.check = function(){
        // 将来増えることを見越して for..in してる
        for( key in this.validates ){
            this[key](this.$target.val()) ? this.valid() : this.invalid();
        }
    }
        
    // 文字が入力されているか
    Validate.prototype.empty = function(data){
        return data != this.validates.empty;
    }
    
    // スペースだけではないか
    Validate.prototype.space = function(data){
        for( var i=0 ; i<data.length ; i++ ){
            if(!data[i].match(this.validates.space)){
                return true;  
            }
        }
        return false;
    }
    
    // 有効
    Validate.prototype.valid = function(){
        this.$submit.removeClass("disabled");
        this.$target.parent().removeClass("has-error");
    }
    
    // 無効
    Validate.prototype.invalid = function(){
        this.$submit.addClass("disabled");
        this.$target.parent().addClass("has-error");
    }
    
    return Validate;
})();


// ----- インスタンス化 -------
$(".comment_form").each(function(){
    new Validate(this);
});

});