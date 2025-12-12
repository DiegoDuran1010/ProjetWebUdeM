/* Auteurs :
Pierre-Nathan Duchesne (20307443)
Diego Felipe Duran Lezama (20246326)
*/

$(document).ready(function () {

// Constantes ("But/habitude": "Max", "unité par défaut")
const goals = {
    "Hydratation": { maxValue: 8,  unit: "verres"},
    "Sommeil":     { maxValue: 8,  unit: "heures"},
    "Exercice":    { maxValue: 30, unit: "minutes"},
    "Lecture":     { maxValue: 45, unit: "minutes"}
};

// Progrès des habitudes
const progress = {
    "Hydratation": 0,
    "Sommeil": 0,
    "Exercice": 0,
    "Lecture": 0
};

// Unités possibles pour chaque habitude
const habitUnits = {
    "Choisir": ["-- Veuillez choisir une habitude --"],
    "Hydratation": ["Verres"],
    "Sommeil": ["Heures", "Minutes"],
    "Exercice": ["Minutes", "Heures"],
    "Lecture": ["Minutes", "Heures"]
};

// Mise-à-jour des unités du formulaire en fonction de l'habitude
$("#habit-select").on("change", function() {
    const habit = $(this).val();
    const unitSelect = $("#unit");

    unitSelect.empty();

    if (habit && habitUnits[habit]) {
        habitUnits[habit].forEach(u => {
            unitSelect.append(`<option value="${u}">${u}</option>`);
        });
    }
});

// Gère les conversions d'unités (heures-minutes)
function convertUnit(habit, value, selectedUnit) {
    const defaultUnit = goals[habit].unit;

    // x minutes -> (x/60) heures
    if (defaultUnit == "heures" && selectedUnit == "Minutes") return value/60;

    // x heures -> (x*60) minutes
    if (defaultUnit == "minutes" && selectedUnit == "Heures") return value*60;

    return value;
}

// Formulaire
$("#habit-form").validate({
    // Validation
    rules: {
        "habit-select": {
            required: true
        },
        quantity: {
            required: true,
            number: true,
            min: 0.1
        },
        unit: {
            required: true
        }
    },

    messages: {
        "habit-select": {
            required: "Veuillez choisir une habitude."
        },
        quantity: {
            required: "Veuillez entrer une quantité.",
            number: "La quantité doit être un nombre.",
            min: "La quantité doit être positive."
        },
        unit: {
            required: "Veuillez choisir une unité."
        }
    },
    
    // Soumission du formulaire
    submitHandler: function (form) {
        // Valeurs choisies par l'utilisateur
        const habit = $("#habit-select").val();
        const quantity = parseFloat($("#quantity").val());
        const unit = $("#unit").val();

        // Mettre à jour les quantités
        progress[habit] += convertUnit(habit, quantity, unit);

        updateGoal(habit);
        return false; // pour ne pas refresh la page
    }
});

// Mise-à-jour des cartes et du tableau
function updateGoal(habit) {
    const max = goals[habit].maxValue;
    const unit = goals[habit].unit;
    let prog = progress[habit];

    // Calcul du pourcentage (100% max)
    const percent = Math.min(100, Math.round((prog / max) * 100));
    
    // Arrondir valeur
    prog = Math.floor(10 * prog) / 10;

    // Mettre à jour la carte
    $(`#cardText-${habit}`).text(`${prog} / ${max} ${unit}`);
    $(`#cardPourcentage-${habit}`).text(`${percent}%`);

    // Enlever l'attribut "hidden" (pour simuler l'ajout)
    $("#progres").removeClass("hidden");
    $("#suivi").removeClass("hidden");
    $(`#card-${habit}`).removeClass("hidden");
    $(`#row-${habit}`).removeClass("hidden");

    // Mettre à jour le tableau
    $("#habits-tbody tr").each(function () {
        if ($(this).find("td:first").text().includes(habit)) {
            $(this).find(".progress-fill").css("width", percent + "%");
            $(this).find(".progress-text").text(`${prog}/${max}`);
            $(this).find("td:last").text(`${percent} %`);
        }
    });
}
});
