$(function(){var a=function(){function a(a,b,c){this.initialized(a,b,c),this.listener()}return a.prototype.initialized=function(a,b,c){this.alredy_count=!1,this.$target=$(a),this.event=b,this.api={url:c,data:this.$target.data("id")}},a.prototype.listener=function(){var a=this;this.$target.on(this.event,function(){a.count(this)})},a.prototype.count=function(){return this.alredy_count?0:(this.alredy_count=!0,void $.get(this.api.url,{id:this.api.data}))},a}(),b=function(){var b=function(b){a.call(this,b,"click","dl_count")};return b}(),c=function(){var b=function(b){a.call(this,b,"play","play_count")};return b}();Object.setPrototypeOf(b.prototype,a.prototype),Object.setPrototypeOf(c.prototype,a.prototype),$(".downloads a").each(function(){new b(this)}),$(".audio").each(function(){new c(this)})}),$(".comment_submit").on("click",function(){var a=$(".comment_form").val(),b=($(".comment").data("name"),"<p>"+a+"</p>");$("#comments").append(b),$(".comment_form").val("")});