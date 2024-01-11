
export class CheckDialog extends Dialog {
    async activateListeners($html) {
        super.activateListeners($html)
        const html = $html[0];
    
        const formGroups = html.querySelectorAll('.form-group');

        function convertSkillsToOptions(skills, prefix=''){
            const result = {};
            for (const key in skills) {
                if (skills.hasOwnProperty(key)) {
                    result[key] = []

                    for (const skillsKey in skills[key].specialisations){
                        result[key].push(skillsKey)
                    }
                }
            }
            return result;
        }
        const optionGroups = convertSkillsToOptions(this.data.actor.system.skills)
        function updateSpeOptions(selectedDomain, speSelect) {
            const allSkills = optionGroups[selectedDomain] || [];
            const allOptionGroups = Object.keys(optionGroups);
    
            // Clear existing options
            speSelect.innerHTML = '';
    
            // Add the optgroup for the selected domain first
            const pure = document.createElement('option');
            pure.value = "pur";
            pure.textContent = game.i18n.localize("SR.jetPur")
            speSelect.appendChild(pure);
            const selectedGroup = optionGroups[selectedDomain];
            if (selectedGroup) {
                const selectedOptgroup = document.createElement('optgroup');
                selectedOptgroup.label = selectedDomain;
    
                selectedGroup.forEach(function (skill) {
                    const optionElement = document.createElement('option');
                    optionElement.value = skill;
                    optionElement.textContent = game.i18n.localize(skill);
                    selectedOptgroup.appendChild(optionElement);
                });
    
                speSelect.appendChild(selectedOptgroup);
            }
    
            // Add other option groups
            allOptionGroups.forEach(function (groupLabel) {
                if (groupLabel !== selectedDomain) {
                    const group = optionGroups[groupLabel];
                    const otherOptgroup = document.createElement('optgroup');
                    otherOptgroup.label = groupLabel;
    
                    group.forEach(function (skill) {
                        const optionElement = document.createElement('option');
                        optionElement.value = skill;
                        optionElement.textContent = game.i18n.localize(skill);
                        otherOptgroup.appendChild(optionElement);
                    });
    
                    speSelect.appendChild(otherOptgroup);
                }
            });
        }

        formGroups.forEach(function (formGroup) {
            const domainSelect = formGroup.querySelector('select.domain');
            const speSelect = formGroup.querySelector('select.spe');
    
            // Add event listener to each domain select
            if(domainSelect && speSelect){

                // Initial update for each form group
                updateSpeOptions(domainSelect.value, speSelect);

                domainSelect.addEventListener('change', function () {
                    updateSpeOptions(domainSelect.value, speSelect);
                });
            }
        });
    }
}