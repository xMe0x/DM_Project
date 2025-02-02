import {
    generateChromosomes,
    calculateFitness,
    crossover,
    mutateOffspring,
    rankingSelection,
    elitismSelection,
    tournamentSelection,
    CalculateBestFitnes
} from './GA_functoin.js';

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("myForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let RoundCro = parseInt(document.getElementById("RoundCro").value);
        let RoundFit = parseInt(document.getElementById("RoundFit").value);
        let round = parseInt(document.getElementById("Round").value);
        let Benefit = parseInt(document.getElementById("Benefit").value);
        const method = document.getElementById('method').value;
        console.log(method);
        let selectedParents = [];
        let bestofelit = [];
        let parent1, parent2;
        let offspring1, offspring2;
        let mutatedOffspring1, mutatedOffspring2;
        let chromosomesWithFitness = [];
        let BestFitnes;
        let group1,group2;
        let group1Result,group2Result;
        let Tornament1,Tornament2;

        if (isNaN(RoundCro) || isNaN(RoundFit)) {
            alert("กรุณากรอกตัวเลขให้ถูกต้อง");
            return;
        }

        for (let i = 0; i < round; i++) {
            console.log("----------------------------------",i+1,"--------------------------------------------");
            if(BestFitnes>=Benefit){
                break;
            }else{
            chromosomesWithFitness = generateChromosomes(RoundCro, RoundFit, method, bestofelit);
            console.log(chromosomesWithFitness);
            let chromosomes = chromosomesWithFitness.map(item => item.chromosome);
            let fitnessValues = chromosomesWithFitness.map(item => item.fitness);
            console.log("Initial Chromosomes:", chromosomesWithFitness);

            if (method === "ranking") {
                selectedParents = rankingSelection(chromosomes, fitnessValues);
            } else if (method === "elitism") {
                console.log("Bestofelit Selected:", bestofelit);
                bestofelit = elitismSelection(chromosomesWithFitness);
                selectedParents = chromosomesWithFitness.filter(ch => ch !== bestofelit);
            } else if (method === "tournament") {
                let tournamentSize = Math.floor(chromosomes.length / 2);
                let group1Result = tournamentSelection(chromosomes, fitnessValues, tournamentSize);
                console.error("group1Result",group1Result.tournamentCandidates);
                if (group1Result.tournamentCandidates.length === 0) {
                    console.error("Error: Group 1 could not be selected.");
                } else {
                     group1 = group1Result.tournamentCandidates[0]; // เลือกตัวที่ดีที่สุดใน Group 1
                    let { remainingChromosomes, remainingFitnessValues } = group1Result;
                    console.log("Group 1 Winner:", group1);
                
                     group2Result = tournamentSelection(remainingChromosomes, remainingFitnessValues, tournamentSize);
                    console.error("group2Result",group2Result.tournamentCandidates);
                    if (group2Result.tournamentCandidates.length === 0) {
                        console.error("Error: Group 2 could not be selected.");
                    } else {
                        group2 = group2Result.tournamentCandidates[0]; // เลือกตัวที่ดีที่สุดใน Group 2
                        console.log("Group 2 Winner:", group2);
                    }
                }
                Tornament1 = group1Result.tournamentCandidates;
                Tornament2 = group2Result.tournamentCandidates;
            }
            console.log("Selected Parents:", selectedParents);
            if(method=="tournament"){
                console.log("group1:", group1);
                parent1=group1;
                parent2=group2;
                console.log("parent1:", parent1);
                console.log("parent2:", parent2);
            }else{
            do {
                parent1 = selectedParents[Math.floor(Math.random() * selectedParents.length)];
                parent2 = selectedParents[Math.floor(Math.random() * selectedParents.length)];
            
            } while (parent1 === parent2);
            }
            [offspring1, offspring2] = crossover(parent1.chromosome, parent2.chromosome);
            console.log("Offspring after Crossover:", offspring1, offspring2);

             mutatedOffspring1 = mutateOffspring(offspring1.chromosome);
             mutatedOffspring2 = mutateOffspring(offspring2.chromosome);
            console.log("Offspring after Mutation:", mutatedOffspring1, mutatedOffspring2);

             BestFitnes = CalculateBestFitnes(offspring1.fitness, offspring2.fitness, mutatedOffspring1.fitness, mutatedOffspring2.fitness);
            console.log(BestFitnes);
        
        }

        }
        // **แสดงผลในหน้าเว็บ**
        if (method === "ranking") {
            document.getElementById("output").innerHTML = `
    <h3 style="color: #333;">ผลลัพธ์:</h3>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Chromosomes</th>
<td style="border: 1px solid #ddd; padding: 8px;">
                 ${chromosomesWithFitness.map(chromosome => `Chromosome: ${chromosome.chromosome.join(', ')} Fitness: ${chromosome.fitness}`).join('<br> ')}
            </td>
        </tr>
        <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Selected</th>
<td style="border: 1px solid #ddd; padding: 8px;">
                ${selectedParents.map(parent => `Chromosome: ${parent.chromosome.join(', ')} Fitness: ${parent.fitness}`).join('<br> ')}
            </td>  
        </tr>
        <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Selected Parent 1</th>
            <td style="border: 1px solid #ddd; padding: 8px;">
                ${parent1.chromosome.join(',')}
            </td>  

        </tr>
        <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Selected Parent 2</th>
      <td style="border: 1px solid #ddd; padding: 8px;">
                ${parent2.chromosome.join(',')}
            </td>  
        </tr>
        <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Offspring (After Crossover)</th>
           <td style="border: 1px solid #ddd; padding: 8px;">
                chromosome: [${offspring1.chromosome.join(', ')}], fitness: ${offspring1.fitness} <br> chromosome: [${offspring2.chromosome.join(', ')}], fitness: ${offspring2.fitness}
            </td>
        </tr>
        <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Offspring (After Mutation)</th>
             <td style="border: 1px solid #ddd; padding: 8px;">
                chromosome: [${mutatedOffspring1.chromosome.join(', ')}], fitness: ${mutatedOffspring1.fitness} <br> chromosome: [${mutatedOffspring2.chromosome.join(', ')}], fitness: ${mutatedOffspring2.fitness}
            </td>
        </tr>
        <tr>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Best of Fitness Value</th>
             <td style="border: 1px solid #ddd; padding: 8px;">
            BestFitness Value : ${BestFitnes}
            </td>
        </tr>
    </table>
`;
        }else if(method==="elitism"){
            document.getElementById("output").innerHTML = `
            <h3 style="color: #333;">ผลลัพธ์:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Chromosomes</th>
        <td style="border: 1px solid #ddd; padding: 8px;">
                         ${chromosomesWithFitness.map(chromosome => `Chromosome: ${chromosome.chromosome.join(', ')} Fitness: ${chromosome.fitness}`).join('<br> ')}
                    </td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Selected</th>
        <td style="border: 1px solid #ddd; padding: 8px;">
    ${chromosomesWithFitness.map(chromosome => `Chromosome: ${chromosome.chromosome.join(', ')} Fitness: ${chromosome.fitness}`).join('<br> ')}
                    </td>  
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Best Parent</th>
                        <td style="border: 1px solid #ddd; padding: 8px;">
                    Chromosome: ${bestofelit.chromosome.join(', ')} Fitness: ${bestofelit.fitness}
                </td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Selected Parent 1</th>
                    <td style="border: 1px solid #ddd; padding: 8px;">${parent1.chromosome.join(', ')}</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Selected Parent 2</th>
                    <td style="border: 1px solid #ddd; padding: 8px;">${parent2.chromosome.join(', ')}</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Offspring (After Crossover)</th>
                   <td style="border: 1px solid #ddd; padding: 8px;">
                        chromosome: [${offspring1.chromosome.join(', ')}], fitness: ${offspring1.fitness} <br> chromosome: [${offspring2.chromosome.join(', ')}], fitness: ${offspring2.fitness}
                    </td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Offspring (After Mutation)</th>
                     <td style="border: 1px solid #ddd; padding: 8px;">
                        chromosome: [${mutatedOffspring1.chromosome.join(', ')}], fitness: ${mutatedOffspring1.fitness} <br> chromosome: [${mutatedOffspring2.chromosome.join(', ')}], fitness: ${mutatedOffspring2.fitness}
                    </td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Best of Fitness Value</th>
                     <td style="border: 1px solid #ddd; padding: 8px;">
                    BestFitness Value : ${BestFitnes}
                    </td>
                </tr>
            </table>
        `;
        }else if(method==="tournament"){
            document.getElementById("output").innerHTML = `
            <h3 style="color: #333;">ผลลัพธ์:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Chromosomes</th>
        <td style="border: 1px solid #ddd; padding: 8px;">
                           ${chromosomesWithFitness.map(chromosome => `Chromosome: ${chromosome.chromosome.join(', ')} Fitness: ${chromosome.fitness}`).join('<br> ')}
                    </td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Selected Tornament 1</th>
                <td style="border: 1px solid #ddd; padding: 8px;">
                 ${Tornament1.map(chromosome => `Chromosome: ${chromosome.chromosome.join(', ')} Fitness: ${chromosome.fitness}`).join('<br> ')}
                    </td>  
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Selected Tornament 2</th>
                <td style="border: 1px solid #ddd; padding: 8px;">
                      ${Tornament2.map(chromosome => `Chromosome: ${chromosome.chromosome.join(', ')} Fitness: ${chromosome.fitness}`).join('<br> ')}
                    </td>  
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Selected Parent 1</th>
                    <td style="border: 1px solid #ddd; padding: 8px;">${parent1.chromosome.join(', ')}</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Selected Parent 2</th>
                    <td style="border: 1px solid #ddd; padding: 8px;">${parent2.chromosome.join(', ')}</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Offspring (After Crossover)</th>
                   <td style="border: 1px solid #ddd; padding: 8px;">
                        chromosome: [${offspring1.chromosome.join(', ')}], fitness: ${offspring1.fitness} <br> chromosome: [${offspring2.chromosome.join(', ')}], fitness: ${offspring2.fitness}
                    </td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Offspring (After Mutation)</th>
                     <td style="border: 1px solid #ddd; padding: 8px;">
                        chromosome: [${mutatedOffspring1.chromosome.join(', ')}], fitness: ${mutatedOffspring1.fitness} <br> chromosome: [${mutatedOffspring2.chromosome.join(', ')}], fitness: ${mutatedOffspring2.fitness}
                    </td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Best of Fitness Value</th>
                     <td style="border: 1px solid #ddd; padding: 8px;">
                    BestFitness Value : ${BestFitnes}
                    </td>
                </tr>
            </table>
        `;
        }




    });
});
