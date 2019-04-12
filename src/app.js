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
            at_to : 2,
            at_ag : 2,
            at_hp : 10,
            ar_hd : 0,
            ar_ra : 0,
            ar_la : 0,
            ar_bd : 0,
            ar_rl : 0,
            ar_ll : 0
        },
        renegade_militia : {
            id : 'renegade_militia',
            title : 'Renegade Militia',
            at_to : 3,
            at_ag : 3,
            at_hp : 10,
            ar_hd : 4,
            ar_ra : 4,
            ar_la : 4,
            ar_bd : 4,
            ar_rl : 4,
            ar_ll : 4 
        },
        chaos_marine_elite : {
            id : 'chaos_marine_elite',
            title : 'Chaos Marine Elite',
            at_to : 4,
            at_ag : 4,
            at_hp : 29,
            ar_hd : 8,
            ar_ra : 8,
            ar_la : 8,
            ar_bd : 10,
            ar_rl : 8,
            ar_ll : 8 
        },
        tau_fire_warrior : {
            id : 'tau_fire_warrior',
            title : 'Tau Fire Warrior',
            at_to : 3,
            at_ag : 2,
            at_hp : 12,
            ar_hd : 6,
            ar_ra : 6,
            ar_la : 6,
            ar_bd : 6,
            ar_rl : 6,
            ar_ll : 6  
        },
        eldar_dark_reaper : {
            id : 'eldar_dark_reaper',
            title : 'Eldar Dark Reaper',
            at_to : 3,
            at_ag : 5,
            at_hp : 18,
            ar_hd : 7,
            ar_ra : 7,
            ar_la : 7,
            ar_bd : 7,
            ar_rl : 7,
            ar_ll : 7  
        },
        eldar_howling_banshee : {
            id : 'eldar_howling_banshee',
            title : 'Eldar Howling Banshee',
            at_to : 3,
            at_ag : 5,
            at_hp : 15,
            ar_hd : 5,
            ar_ra : 5,
            ar_la : 5,
            ar_bd : 5,
            ar_rl : 5,
            ar_ll : 5  
        },
        eldar_guardian : {
            id : 'eldar_guardian',
            title : 'Eldar Guardian',
            at_to : 3,
            at_ag : 4,
            at_hp : 12,
            ar_hd : 3,
            ar_ra : 4,
            ar_la : 4,
            ar_bd : 4,
            ar_rl : 4,
            ar_ll : 4  
        },
        dark_eldar_kabalite_warrior : {
            id : 'dark_eldar_kabalite_warrior',
            title : 'Dark Eldar Kabalite Warrior',
            at_to : 3,
            at_ag : 10,
            at_hp : 10,
            ar_hd : 4,
            ar_ra : 4,
            ar_la : 4,
            ar_bd : 4,
            ar_rl : 4,
            ar_ll : 4    
        },
        ork_nob : {
            id : 'ork_nob',
            title : 'Ork Nob',
            at_to : 4,
            at_ag : 3,
            at_hp : 21,
            ar_hd : 2,
            ar_ra : 2,
            ar_la : 2,
            ar_bd : 2,
            ar_rl : 2,
            ar_ll : 2    
        },
        genestealer : {
            id : 'genestealer',
            title : 'Genestealer',
            at_to : 8,
            at_ag : 8,
            at_hp : 20,
            ar_hd : 4,
            ar_ra : 4,
            ar_la : 4,
            ar_bd : 4,
            ar_rl : 4,
            ar_ll : 4    
        }
    },
    
    currentGUID : null,
    
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
        $('input[type="checkbox"]').on('click', function() {
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
    
    highlightPlayers : function() {
        var character = $('#characters .character');
        for(var i = 0; i < character.length; i++) {
            if(app.isChecked($(character[i]).find('input[name="player"]'))) {
                // player
                if(!$(character[i]).hasClass('btn-success'))
                    $(character[i]).addClass('btn-success');
            } else {
                // npc
                if($(character[i]).hasClass('btn-success'))
                    $(character[i]).removeClass('btn-success');
            }
        }
    },
    
    setupRollInitiative : function() {
        $('#btn-roll-initiative').on('click', app.rollInitiative_OnClick);
    },
    
    setupAddPreset : function(element) {
        $(element).html('');
        $(element).append($('<option>', {
            value: '',
            text: 'Add Character'
        }));
        jQuery.each(app.presetData, function(index, preset) {
            $(element).append($('<option>', {
                value: preset.id,
                text: preset.title
            }));
        });
        $(element).on('change', app.addPreset_OnClick);
    },
    
    exportShow_OnClick : function(event) {
        event.preventDefault();
        $('#modal-export').modal('show');
        var data = localStorage.getItem('data');
        $('#modal-export textarea[name="data"]').val(data);
    },
    
    importShow_OnClick : function(event) {
        event.preventDefault();
        $('#modal-import').modal('show');
    },
    
    import_OnClick : function(event) {
        console.log('here');
        event.preventDefault();
        localStorage.setItem('data', 
            $('#modal-import #txt-data').val()    
        );
        $('#modal-import').modal('hide');
        app.load();
    },
    
    addPreset_OnClick : function(event) {
        var selected = $(event.target).val();
        var preset = app.presetData[selected];
        preset.guid = app.guid();
        $('#characters>.list').append(app.template('tmpl-character', preset));
        app.save();
        app.setupAutoSave();
        $('select[name="nps-preset"]').val('');
    },
    
    clearDamageLog_OnClick : function(event, guid) {
        var character = app.getCharacterFromGUID(guid);
        $(character).find('.damage .list table').html('');
        app.save();
    },
    
    removeCharacter_OnClick : function(event, guid) {        
        event.preventDefault();
        if (window.confirm("Are you sure?")) {
            var character = app.getCharacterFromGUID(guid);
            character.remove();
            app.save();
        }
    },
    
    clearCharacters : function() {
        if (window.confirm("Are you sure?")) {
            $('#characters>.list').html('');
        }
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
            return parseFloat(b.roll) - parseFloat(a.roll);
        });
        
        for(i = 0; i < rolls.length; i++) { 
            if(i > 0) {
                app.getCharacterFromGUID(rolls[i].guid).insertAfter(
                    app.getCharacterFromGUID(rolls[i-1].guid)
                );
            }
        }
    },
    
    getCharacterFromGUID : function(guid) {
        
        var characters = $('.character');
        
        for(var i = 0; i < characters.length; i++) {
            if($(characters[i]).find('input[name="guid"]').val() == guid) {
                return $(characters[i]);
            }
        }
        
        return null;  
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
    
    isChecked : function(element) {
        if ($(element).is(":checked"))
            return 1;
        else
            return 0;
    },
    
    save : function() {
        
        app.highlightPlayers();
        
        var data = {
            characters : []
        };

        var characters = $('#characters .character');
        
        for(var i = 0; i < characters.length; i++) {
            
            data.characters.push({
                title : $(characters[i]).find('input[name="title"]').val(),
                guid : $(characters[i]).find('input[name="guid"]').val(),
                at_to : $(characters[i]).find('input[name="attribute-toughness"]').val(),
                at_ag : $(characters[i]).find('input[name="attribute-agility"]').val(),
                at_hp : $(characters[i]).find('input[name="attribute-hitpoints"]').val(),
                ar_hd : $(characters[i]).find('input[name="armour-head"]').val(),
                ar_ra : $(characters[i]).find('input[name="armour-right-arm"]').val(),
                ar_la : $(characters[i]).find('input[name="armour-left-arm"]').val(),
                ar_bd : $(characters[i]).find('input[name="armour-body"]').val(),
                ar_rl : $(characters[i]).find('input[name="armour-right-leg"]').val(),
                ar_ll : $(characters[i]).find('input[name="armour-left-leg"]').val(),
                player : app.isChecked($(characters[i]).find('input[name="player"]')),
                damage : app.getDamageArray(characters[i])
            });
        }
        
        localStorage.setItem('data', JSON.stringify(data));
    },
    
    load : function() {
        if(localStorage.getItem('data') != '') {
            var data = JSON.parse(localStorage.getItem('data'));
            if(data != null) {
                for(var i = 0; i < data.characters.length; i++) {
                    $('#characters>.list').append(app.template('tmpl-character', data.characters[i]));
                }      
            }
            app.setupAutoSave();
            app.highlightPlayers();
        } 
    },
    
    getDamageArray : function(character) {
        
        var damageRows = $(character).find('.damage .list table tr');
        var damageArr = [];
        for(var i = 0; i < damageRows.length; i++) {
            var hitLocation = $(damageRows[i]).find('td.loc').html();
            var damage = app.parseInt($(damageRows[i]).find('td.dam').html());
            damageArr.push([hitLocation, damage]);
        }

        return damageArr;
    },
    
    addDamage_OnClick : function(guid) {
        
        app.currentGUID = guid;
        
        $('#modal-damage input[name="roll-to-hit"]').val('');
        $('#modal-damage input[name="pen"]').val('');
        $('#modal-damage input[name="damage"]').val('');
        
        $('#modal-damage').modal('show');
    },
    
    applyDamage_OnClick : function(event) {
        
        try {
        
            event.preventDefault();
            
            var rollToHit = $('#modal-damage input[name="roll-to-hit"]').val();
            if(rollToHit.length < 2)
                rollToHit = '0' + rollToHit;
            var character = app.getCharacterFromGUID(app.currentGUID);
            var hitLocationNumber = app.getHitLocationNumber(rollToHit);
            var hitLocation = app.getHitLocation(hitLocationNumber);
            var pen = app.parseInt($('#modal-damage input[name="pen"]').val());
            var damage = app.parseInt($('#modal-damage input[name="damage"]').val());
            var armour = app.parseInt($(character).find('input[name="armour-' + hitLocation + '"]').val());
            var armourResult = ((armour - pen) < 0) ? 0 : armour - pen;
            var toughness = app.parseInt($(character).find('input[name="attribute-toughness"]').val());;
            var damageTotal = (damage - armourResult) - toughness;
            
            if(damageTotal > 0) {
                $(character).find('.damage .list table').append('<tr><td class="loc">' + hitLocation + '</td><td class="dam">' + damageTotal + '</td></tr>');
                var currentHP = app.parseInt($(character).find('input[name="attribute-hitpoints"]').val());
                $(character).find('input[name="attribute-hitpoints"]').val(currentHP - damageTotal);
                app.save();
            } else {
                alert('No Damage');
            }
            
            $('#modal-damage').modal('hide');
            
        } catch(err) {
            alert(err.message);
        }
    },
    
    parseInt : function(string) {
        if(string == undefined || string == '') 
            return 0;
        else 
            return parseInt(string);
    },
    
    getHitLocationNumber : function(roll) {
    
        if(roll == 100) {
            return 00;
        } else {
            var rolla = roll.toString().split('');
            var switchRoll = rolla[1] + rolla[0];
            return parseInt(switchRoll);
        }
    },
    
    getHitLocation : function(hitLocationNumber) {
        if(hitLocationNumber < 11)
            return 'head';
        if(hitLocationNumber > 10 && hitLocationNumber < 21)
            return 'right-arm';
        if(hitLocationNumber > 20 && hitLocationNumber < 31)
            return 'left-arm';
        if(hitLocationNumber > 30 && hitLocationNumber < 71)
            return 'body';
        if(hitLocationNumber > 70 && hitLocationNumber < 86)
            return 'right-leg';
        if(hitLocationNumber > 85 && hitLocationNumber < 101)
            return 'left-leg';
    }
}

$(function() {
    app.init();
});