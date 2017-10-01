var app = {
    
    presetData : {
        blank : {
            id : 'blank',
            title : 'Blank',
            at_to : 0,
            at_ag : 0,
            at_hp : 0,
            ar_hd : 0,
            ar_ra : 0,
            ar_la : 0,
            ar_bd : 0,
            ar_rl : 0,
            ar_ll : 0
        },
        human : {
            id : 'human',
            title : 'Human',
            at_to : 3,
            at_ag : 3,
            at_hp : 12,
            ar_hd : 2,
            ar_ra : 2,
            ar_la : 2,
            ar_bd : 2,
            ar_rl : 2,
            ar_ll : 2
        },
    },
    
    init : function() {
        app.setupAddPreset($('#characters select[name="nps-preset"]'));
        app.setupRollInitiative();
        app.setupClearCharacters();
        app.load();
    },
    
    setupAutoSave : function() {
        $('input[type="text"]').on('change keydown paste input', function() {
            app.save();
        });
    },
    
    setupClearCharacters : function() {
        $('#btn-clear-characters').on('click', function(event) {
            event.preventDefault();
            app.clearCharacters(); 
            app.save();
        });
    },
    
    setupRollInitiative : function() {
        $('#btn-roll-initiative').on('click', app.rollInitiative_OnClick);
    },
    
    setupAddPreset : function(element) {
        $(element).html('');
        $(element).append($('<option>', {
            value: '',
            text: ''
        }));
        jQuery.each(app.presetData, function(index, preset) {
            $(element).append($('<option>', {
                value: preset.id,
                text: preset.title
            }));
        });
        $(element).on('click', app.addPreset_OnClick);
    },
    
    addPreset_OnClick : function(event) {
        var selected = $(event.target).val();
        var preset = app.presetData[selected];
        preset.guid = app.guid();
        $('#characters .list').append(app.template('tmpl-character', preset));
        app.save();
        app.setupAutoSave();
    },
    
    clearCharacters : function() {
        $('#characters .list').html('');
    },

    template : function(elementId, variables) {
        var source   = $('#' + elementId).html();
        var template = Handlebars.compile(source);
        return template(variables);
    },
    
    rollInitiative_OnClick : function() {
        
        var rolls = [];
        var character = $('#characters .character');
        var at_to = 0;
        var roll = 0;
        var guid = '';
        
        for(var i = 0; i < character.length; i++) {
            at_to = parseInt($(character[i]).find('input[name="attribute-toughness"]').val());
            guid = $(character[i]).find('input[name="guid"]').val();
            roll = app.rollDice(10);
            rolls.push({
                guid : guid,
                roll : roll + at_to,
                at_to : at_to
            });
        }
        
        rolls.sort(function(a, b) {
            // if(b.roll = a.roll) 
            //     return 
            return parseFloat(b.roll) - parseFloat(a.roll);
        });
        
        for(i = 0; i < rolls.length; i++) { 
            if(i > 0) {
                app.getCharacterFromGUID(rolls[i].guid).insertAfter(
                    app.getCharacterFromGUID(rolls[i-1].guid)
                );
            }
        }
        
        console.log(rolls);
    },
    
    getCharacterFromGUID : function(guid) {
        return $('input[value="' + guid + '"').parents('.character');  
    },
    
    rollDice : function(sides) {
        with(Math) return 1 + floor(random() * sides);
    },
    
    guid : function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
    
    save : function() {
        
        var data = {
            characters : []
        };

        var characters = $('#characters .character');
        
        for(var i = 0; i < characters.length; i++) {
            data.characters.push({
                title : $(characters[i]).find('input[name="title"]').val(),
                key : $(characters[i]).find('input[name="guid"]').val(),
                at_to : $(characters[i]).find('input[name="attribute-toughness"]').val(),
                at_ag : $(characters[i]).find('input[name="attribute-agility"]').val(),
                at_hp : $(characters[i]).find('input[name="attribute-hitpoints"]').val(),
                ar_hd : $(characters[i]).find('input[name="armour-head"]').val(),
                ar_ra : $(characters[i]).find('input[name="armour-right-arm"]').val(),
                ar_la : $(characters[i]).find('input[name="armour-left-arm"]').val(),
                ar_bd : $(characters[i]).find('input[name="armour-body"]').val(),
                ar_rl : $(characters[i]).find('input[name="armour-right-leg"]').val(),
                ar_ll : $(characters[i]).find('input[name="armour-left-leg"]').val()
            });
        }
            
        localStorage.setItem('data', JSON.stringify(data));
    },
    
    load : function() {
        
        var data = JSON.parse(localStorage.getItem('data'));
        if(data != null) {
            for(var i = 0; i < data.characters.length; i++) {
                $('#characters .list').append(app.template('tmpl-character', data.characters[i]));
            }      
        }
        app.setupAutoSave();
    }
}

$(function() {
    app.init();
});