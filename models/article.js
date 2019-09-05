let mongoose = require('mongoose');

//Article Schema
const articleSchema = mongoose.Schema;
const NewsSchema = new articleSchema({
  title:{
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  },
  address:{
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true
  },
  opttime:{
    type: String,
    required: true
  },
  closetime:{
    type: String,
    required: true
  },
  memberfeed:{
    type: String,
    required: true
  },
  photo:{
    type: String
  },
  classes:{
    type: [String]
  },
  author:{
    type: String,
    required: true
  },
  otinfo:{
    type: String,
    required: true
  }
});
NewsSchema.virtual('classes_name').get(function(){
  var arr =[];
  for(var i in this.classes ) {
    switch (this.classes[i]) {
      case '1':
        arr.push('Yoga');
        break;
      case '2':
        arr.push('KickBoxing');
        break;
      case '3':
        arr.push('Personal Training');
        break;
      case '4':
        arr.push('Zumba');
        break;
      case '5':
        arr.push('Kilocycle');
        break;
      case '6':
        arr.push('barre-less-barre');
        break;
      case '7':
        arr.push('Cardio funk dance party');
        break;
      default:

    }
  }
  return arr;
})

let Article = module.exports = mongoose.model('Article', NewsSchema);
