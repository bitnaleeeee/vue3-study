import { FixedSiteString, safetyInspection,SchdmitCalculateMethod, HardSchdmitCalculateMethod } from './inspection'
import { FixedSite, grade } from "./inspection"
import { DataTypes } from "../data"
import { appearenceInspection, AreaPercent  } from './appearence'
import _ from 'lodash'

export class InspectionScore {
    public Count: number
    public Score: number
    public Avg: number
    public Grade: grade
    public Site: FixedSite

    constructor(_count: number, _score: number, _grade: grade, _site: FixedSite) {
        this.Count = _count
        this.Score = _score
        this.Grade = _grade
        this.Site = _site
        this.Avg = 0
    }

    ToGrade(score: number) : grade {
        if(score > 7) return grade.E
        else if(score > 5) return grade.D
        else if(score > 3) return grade.C
        else if(score > 1) return grade.B
        
        return grade.A
    }

    CalcGrade() : void {
        if(this.Count == 0) return
        this.Avg = this.Score / this.Count
        this.Grade = this.ToGrade(this.Avg)
    }

    getCount() : number {
        return this.Count
    }

    getScore() : number {
        return this.Score
    }

    getAvg() : number {
        return this.Avg
    }

    getGrade() : grade {
        return this.Grade
    }

    getSite() : FixedSite {
        return this.Site
    }
}

export class InspectionScoreGroup {
    public Slab : InspectionScore
    public Beam : InspectionScore
    public Girder : InspectionScore
    public Column : InspectionScore
    public Wall : InspectionScore
    
    constructor() {
        this.Slab = new InspectionScore(0,0,grade.A,FixedSite.Slab)
        this.Beam = new InspectionScore(0,0,grade.A,FixedSite.Beam)
        this.Girder = new InspectionScore(0,0,grade.A,FixedSite.Girder)
        this.Column = new InspectionScore(0,0,grade.A,FixedSite.Column)
        this.Wall = new InspectionScore(0,0,grade.A,FixedSite.Wall)
    }

    CalcGrade() : void {
        this.Slab.CalcGrade()
        this.Beam.CalcGrade()
        this.Girder.CalcGrade()
        this.Column.CalcGrade()
        this.Wall.CalcGrade()
    }

    AddScore(type: FixedSite, score: number) : void {
        switch(type) {
            case FixedSite.Slab:
                this.Slab.Score += score
                this.Slab.Count++
                break
            case FixedSite.Beam:
                this.Beam.Score += score
                this.Beam.Count++
                break
            case FixedSite.Girder:
                this.Girder.Score += score
                this.Girder.Count++
                break
            case FixedSite.Column:
                this.Column.Score += score
                this.Column.Count++
                break
            case FixedSite.Wall:
                this.Wall.Score += score
                this.Wall.Count++
                break       
        }
    }
}

export class InspectionArray {
    public Scores: Array<number>

    constructor() {
        this.Scores = []
    }

    AddScore(score: number) {
        this.Scores.push(score)
    }

    SortScores() {
        this.Scores = this.Scores.sort((a,b) => a - b)
    }

    SumScoreReverse(count: number) : number {
        let _count = count
        let totalScore = 0

        if(this.Scores.length - count <= 0) {
            _count = this.Scores.length
        }

        for(let i=0; i < _count; i++) {
            totalScore += this.Scores[this.Scores.length - i - 1]
        }

        return totalScore
    }

    GetScoreCount() : number {
        return this.Scores.length
    }
}

export class AreaPercentCount {
    public lessCount : number
    public overCount : number

    constructor() {
        this.lessCount = 0
        this.overCount = 0
    }

    AddCount(type: AreaPercent) {
        switch(type) {
        case AreaPercent.LESS_THEN_20:
        case AreaPercent.LESS_THEN_10:
            this.lessCount++
            break
        case AreaPercent.OVER_THEN_20:
        case AreaPercent.OVER_THEN_10:
            this.overCount++
            break
        }
    }

    GetLessCount() : number { return this.lessCount }
    GetOverCount() : number { return this.overCount }
}

export class InspectionArrayGroup {
    public Slab : InspectionArray
    public Beam : InspectionArray
    public Girder : InspectionArray
    public Column : InspectionArray
    public Wall : InspectionArray

    public Slab_AreaCount : AreaPercentCount
    public Beam_AreaCount : AreaPercentCount
    public Girder_AreaCount : AreaPercentCount
    public Column_AreaCount : AreaPercentCount
    public Wall_AreaCount : AreaPercentCount

    constructor() {
        this.Slab = new InspectionArray
        this.Beam = new InspectionArray
        this.Girder = new InspectionArray
        this.Column = new InspectionArray
        this.Wall = new InspectionArray

        this.Slab_AreaCount = new AreaPercentCount()
        this.Beam_AreaCount = new AreaPercentCount()
        this.Girder_AreaCount = new AreaPercentCount()
        this.Column_AreaCount = new AreaPercentCount()
        this.Wall_AreaCount = new AreaPercentCount()
    }

    AddScore(site: FixedSite, score: number) {
        switch(site) {
        case FixedSite.Slab:
            this.Slab.AddScore(score)
            break
        case FixedSite.Beam:
            this.Beam.AddScore(score)
            break
        case FixedSite.Girder:
            this.Girder.AddScore(score)
            break
        case FixedSite.Column:
            this.Column.AddScore(score)
            break
        case FixedSite.Wall:
            this.Wall.AddScore(score)
            break
        }
    }

    AddAreaPercent(site: FixedSite, percent: AreaPercent | undefined) {
        if(percent == undefined) return


        switch(site) {
        case FixedSite.Slab:
            this.Slab_AreaCount.AddCount(percent)
            break
        case FixedSite.Beam:
            this.Beam_AreaCount.AddCount(percent)
            break
        case FixedSite.Girder:
            this.Girder_AreaCount.AddCount(percent)
            break
        case FixedSite.Column:
            this.Column_AreaCount.AddCount(percent)
            break
        case FixedSite.Wall:
            this.Wall_AreaCount.AddCount(percent)
            break
        }
    }

    GetCount(site: FixedSite) {
        switch(site) {
        case FixedSite.Slab:
            return this.Slab.GetScoreCount()
        case FixedSite.Beam:
            return this.Beam.GetScoreCount()
        case FixedSite.Girder:
            return this.Girder.GetScoreCount()
        case FixedSite.Column:
            return this.Column.GetScoreCount()
        case FixedSite.Wall:
            return this.Wall.GetScoreCount()
        }

        return 0
    }

    CalcScore(site: FixedSite) {
        let minimum = 0

        switch(site) {
            case FixedSite.Column:
            case FixedSite.Wall:
                minimum = 0.2
                break
            case FixedSite.Girder:
            case FixedSite.Beam:
            case FixedSite.Slab:
                minimum = 0.3
                break
        }

        let totalCount = 0
        let score = 0
        let lessCount = 0
        let overCount = 0
        switch(site) {
        case FixedSite.Slab:
            totalCount = Math.ceil(this.Slab.GetScoreCount() * minimum)
            this.Slab.SortScores()
            score = this.Slab.SumScoreReverse(totalCount)
            lessCount = this.Slab_AreaCount.GetLessCount()
            overCount = this.Slab_AreaCount.GetOverCount()
            break
        case FixedSite.Beam:
            totalCount = Math.ceil(this.Beam.GetScoreCount() * minimum)
            this.Beam.SortScores()
            score = this.Beam.SumScoreReverse(totalCount)
            lessCount = this.Beam_AreaCount.GetLessCount()
            overCount = this.Beam_AreaCount.GetOverCount()
            break
        case FixedSite.Girder:
            totalCount = Math.ceil(this.Girder.GetScoreCount() * minimum)
            this.Girder.SortScores()
            score = this.Girder.SumScoreReverse(totalCount)
            lessCount = this.Girder_AreaCount.GetLessCount()
            overCount = this.Girder_AreaCount.GetOverCount()
            break
        case FixedSite.Column:
            totalCount = Math.ceil(this.Column.GetScoreCount() * minimum)
            this.Column.SortScores()
            score = this.Column.SumScoreReverse(totalCount)
            lessCount = this.Column_AreaCount.GetLessCount()
            overCount = this.Column_AreaCount.GetOverCount()
            break
        case FixedSite.Wall:
            totalCount = Math.ceil(this.Wall.GetScoreCount() * minimum)
            this.Wall.SortScores()
            score = this.Wall.SumScoreReverse(totalCount)
            lessCount = this.Wall_AreaCount.GetLessCount()
            overCount = this.Wall_AreaCount.GetOverCount()
            break
        }

        if(totalCount == 0) return 0
        
        let areaScore = 0
        if(lessCount + overCount > 0) {
            areaScore = ((score * 0.1) * overCount) / (lessCount + overCount)
        }

        return (score/totalCount) + areaScore
    }
}

export enum AreaAgingType {
    Exfoliation = '박리',
    Spalling = '박락, 층분리',
    Leak = '누수, 백태',
    Exposure = '철근 노출'
}

export class AreaAgingScorePart {
    public Exfoliation : InspectionArray // 박리
    public Spalling : InspectionArray // 박락,층분리
    public Leak : InspectionArray // 누수, 백태
    public Exposure : InspectionArray // 철근 노출

    public Exfoliation_AreaCount : AreaPercentCount
    public Spalling_AreaCount : AreaPercentCount
    public Leak_AreaCount : AreaPercentCount
    public Exposure_AreaCount : AreaPercentCount
    
    constructor() {
        this.Exfoliation = new InspectionArray() 
        this.Spalling = new InspectionArray() 
        this.Leak = new InspectionArray() 
        this.Exposure = new InspectionArray() 

        this.Exfoliation_AreaCount = new AreaPercentCount()
        this.Spalling_AreaCount = new AreaPercentCount()
        this.Leak_AreaCount = new AreaPercentCount()
        this.Exposure_AreaCount = new AreaPercentCount()
    }

    AddScore(type: AreaAgingType, score: number) {
        switch(type) {
        case AreaAgingType.Exfoliation:
            this.Exfoliation.AddScore(score)
            break
        case AreaAgingType.Spalling:
            this.Spalling.AddScore(score)
            break
        case AreaAgingType.Leak:
            this.Leak.AddScore(score)
            break
        case AreaAgingType.Exposure:
            this.Exposure.AddScore(score)
            break
        }
    }

    AddAreaPercent(type: AreaAgingType, percent: AreaPercent) {
        switch(type) {
        case AreaAgingType.Exfoliation:
            this.Exfoliation_AreaCount.AddCount(percent)
            break
        case AreaAgingType.Spalling:
            this.Spalling_AreaCount.AddCount(percent)
            break
        case AreaAgingType.Leak:
            this.Leak_AreaCount.AddCount(percent)
            break
        case AreaAgingType.Exposure:
            this.Exposure_AreaCount.AddCount(percent)
            break
        }
    }

    CalcScore(type:AreaAgingType, site: FixedSite) {
        let minimum = 0

        switch(site) {
            case FixedSite.Column:
            case FixedSite.Wall:
                minimum = 0.2
                break
            case FixedSite.Girder:
            case FixedSite.Beam:
            case FixedSite.Slab:
                minimum = 0.3
                break
        }


        let totalCount = 0
        let score = 0
        let lessCount = 0
        let overCount = 0
        switch(type) {
        case AreaAgingType.Exfoliation:
            totalCount = Math.ceil(this.Exfoliation.GetScoreCount() * minimum)
            this.Exfoliation.SortScores()
            score = this.Exfoliation.SumScoreReverse(totalCount)
            lessCount = this.Exfoliation_AreaCount.GetLessCount()
            overCount = this.Exfoliation_AreaCount.GetOverCount()
            break
        case AreaAgingType.Exposure:
            totalCount = Math.ceil(this.Exposure.GetScoreCount() * minimum)
            this.Exposure.SortScores()
            score = this.Exposure.SumScoreReverse(totalCount)
            lessCount = this.Exposure_AreaCount.GetLessCount()
            overCount = this.Exposure_AreaCount.GetOverCount()
            break
        case AreaAgingType.Leak:
            totalCount = Math.ceil(this.Leak.GetScoreCount() * minimum)
            this.Leak.SortScores()
            score = this.Leak.SumScoreReverse(totalCount)
            lessCount = this.Leak_AreaCount.GetLessCount()
            overCount = this.Leak_AreaCount.GetOverCount()
            break
        case AreaAgingType.Spalling:
            totalCount = Math.ceil(this.Spalling.GetScoreCount() * minimum)
            this.Spalling.SortScores()
            score = this.Spalling.SumScoreReverse(totalCount)
            lessCount = this.Spalling_AreaCount.GetLessCount()
            overCount = this.Spalling_AreaCount.GetOverCount()
            break
        }

        if(totalCount == 0) return 0
        
        let areaScore = 0
        if(lessCount + overCount > 0) {
            areaScore = ((score * 0.1) * overCount) / (lessCount + overCount)
        }

        return (score/totalCount) + areaScore
    }

    GetScoreCount(type: AreaAgingType) : number {
        switch(type) {
        case AreaAgingType.Exfoliation:
            return this.Exfoliation.GetScoreCount()
        case AreaAgingType.Leak:
            return this.Leak.GetScoreCount()
        case AreaAgingType.Exposure:
            return this.Exposure.GetScoreCount()
        case AreaAgingType.Spalling:
            return this.Spalling.GetScoreCount()
        }

        return 0
    }

    GetScoreCountAll() : number {
        return this.Exfoliation.GetScoreCount() 
            + this.Leak.GetScoreCount()
            + this.Exposure.GetScoreCount()
            + this.Spalling.GetScoreCount()
    }
}

export class AreaAgingScoreGroup {
    public Slab : AreaAgingScorePart
    public Beam : AreaAgingScorePart
    public Girder : AreaAgingScorePart
    public Column : AreaAgingScorePart
    public Wall : AreaAgingScorePart

    constructor() {
        this.Slab = new AreaAgingScorePart()
        this.Beam = new AreaAgingScorePart()
        this.Girder = new AreaAgingScorePart()
        this.Column = new AreaAgingScorePart()
        this.Wall = new AreaAgingScorePart()
    }

    AddScore(type: AreaAgingType, site: FixedSite, score: number) {
        switch(site) {
        case FixedSite.Slab:
            this.Slab.AddScore(type, score)
            break
        case FixedSite.Beam:
            this.Beam.AddScore(type, score)
            break
        case FixedSite.Girder:
            this.Girder.AddScore(type, score)
            break
        case FixedSite.Column:
            this.Column.AddScore(type, score)
            break
        case FixedSite.Wall:
            this.Wall.AddScore(type, score)
            break
        }
    }

    AddAreaPercent(type: AreaAgingType, site: FixedSite, percent: AreaPercent | undefined) {
        if(percent == undefined) return

        switch(site) {
        case FixedSite.Slab:
            this.Slab.AddAreaPercent(type, percent)
            break
        case FixedSite.Beam:
            this.Beam.AddAreaPercent(type, percent)
            break
        case FixedSite.Girder:
            this.Girder.AddAreaPercent(type, percent)
            break
        case FixedSite.Column:
            this.Column.AddAreaPercent(type, percent)
            break
        case FixedSite.Wall:
            this.Wall.AddAreaPercent(type, percent)
            break
        }
    }

    CalcScore(type: AreaAgingType, site: FixedSite) : number {
        switch(site) {
        case FixedSite.Slab:
            return this.Slab.CalcScore(type, site)
        case FixedSite.Beam:
            return this.Slab.CalcScore(type, site)
        case FixedSite.Girder:
            return this.Slab.CalcScore(type, site)
        case FixedSite.Column:
            return this.Slab.CalcScore(type, site)
        case FixedSite.Wall:
            return this.Slab.CalcScore(type, site)
        }

        return 0
    }

    CalcScoreAll() : object {
        let result = [
            {
                site: FixedSite.Slab,
                avg: 0,
                count: 0,
                agingData : [
                    {
                        type: AreaAgingType.Exfoliation,
                        avg: this.Slab.CalcScore(AreaAgingType.Exfoliation, FixedSite.Slab),
                        count: this.Slab.GetScoreCount(AreaAgingType.Exfoliation)
                    },
                    { 
                        type: AreaAgingType.Spalling,
                        avg: this.Slab.CalcScore(AreaAgingType.Spalling, FixedSite.Slab),
                        count: this.Slab.GetScoreCount(AreaAgingType.Spalling)
                    },
                    { 
                        type: AreaAgingType.Leak,
                        avg: this.Slab.CalcScore(AreaAgingType.Leak, FixedSite.Slab),
                        count: this.Slab.GetScoreCount(AreaAgingType.Leak)
                    },
                    {
                        type: AreaAgingType.Exposure,
                        avg: this.Slab.CalcScore(AreaAgingType.Exposure, FixedSite.Slab),
                        count: this.Slab.GetScoreCount(AreaAgingType.Exposure)
                    }
                ]
            },
            {
                site: FixedSite.Beam,
                avg: 0,
                count: 0,
                agingData : [
                    {
                        type: AreaAgingType.Exfoliation,
                        avg: this.Beam.CalcScore(AreaAgingType.Exfoliation, FixedSite.Beam),
                        count: this.Beam.GetScoreCount(AreaAgingType.Exfoliation)
                    },
                    { 
                        type: AreaAgingType.Spalling,
                        avg: this.Beam.CalcScore(AreaAgingType.Spalling, FixedSite.Beam),
                        count: this.Beam.GetScoreCount(AreaAgingType.Spalling)
                    },
                    { 
                        type: AreaAgingType.Leak,
                        avg: this.Beam.CalcScore(AreaAgingType.Leak, FixedSite.Beam),
                        count: this.Beam.GetScoreCount(AreaAgingType.Leak)
                    },
                    { 
                        type: AreaAgingType.Exposure,
                        avg: this.Beam.CalcScore(AreaAgingType.Exposure, FixedSite.Beam),
                        count: this.Beam.GetScoreCount(AreaAgingType.Exposure)
                    }
                ]
            },
            {
                site: FixedSite.Girder,
                avg: 0,
                count: 0,
                agingData : [
                    { 
                        type: AreaAgingType.Exfoliation,
                        avg: this.Girder.CalcScore(AreaAgingType.Exfoliation, FixedSite.Girder),
                        count: this.Girder.GetScoreCount(AreaAgingType.Exfoliation)
                    },
                    { 
                        type: AreaAgingType.Spalling,
                        avg: this.Girder.CalcScore(AreaAgingType.Spalling, FixedSite.Girder),
                        count: this.Girder.GetScoreCount(AreaAgingType.Spalling)
                    },
                    { 
                        type: AreaAgingType.Leak,
                        avg: this.Girder.CalcScore(AreaAgingType.Leak, FixedSite.Girder),
                        count: this.Girder.GetScoreCount(AreaAgingType.Leak)
                    },
                    { 
                        type: AreaAgingType.Exposure,
                        avg: this.Girder.CalcScore(AreaAgingType.Exposure, FixedSite.Girder),
                        count: this.Girder.GetScoreCount(AreaAgingType.Exposure)
                    }
                ]
            },
            {
                site: FixedSite.Column,
                avg: 0,
                count: 0,
                agingData : [
                    { 
                        type: AreaAgingType.Exfoliation,
                        avg: this.Column.CalcScore(AreaAgingType.Exfoliation, FixedSite.Column),
                        count: this.Column.GetScoreCount(AreaAgingType.Exfoliation)
                    },
                    { 
                        type: AreaAgingType.Spalling,
                        avg: this.Column.CalcScore(AreaAgingType.Spalling, FixedSite.Column),
                        count: this.Column.GetScoreCount(AreaAgingType.Spalling)
                    },
                    { 
                        type: AreaAgingType.Leak,
                        avg: this.Column.CalcScore(AreaAgingType.Leak, FixedSite.Column),
                        count: this.Column.GetScoreCount(AreaAgingType.Leak)
                    },
                    { 
                        type: AreaAgingType.Exposure,
                        avg: this.Column.CalcScore(AreaAgingType.Exposure, FixedSite.Column),
                        count: this.Column.GetScoreCount(AreaAgingType.Exposure)
                    }
                ]
            },
            {
                site: FixedSite.Wall,
                avg: 0,
                count: 0,
                agingData : [
                    { 
                        type: AreaAgingType.Exfoliation,
                        avg: this.Wall.CalcScore(AreaAgingType.Exfoliation, FixedSite.Wall),
                        count: this.Wall.GetScoreCount(AreaAgingType.Exfoliation)
                    },
                    { 
                        type: AreaAgingType.Spalling,
                        avg: this.Wall.CalcScore(AreaAgingType.Spalling, FixedSite.Wall),
                        count: this.Wall.GetScoreCount(AreaAgingType.Spalling)
                    },
                    { 
                        type: AreaAgingType.Leak,
                        avg: this.Wall.CalcScore(AreaAgingType.Leak, FixedSite.Wall),
                        count: this.Wall.GetScoreCount(AreaAgingType.Leak)
                    },
                    { 
                        type: AreaAgingType.Exposure,
                        avg: this.Wall.CalcScore(AreaAgingType.Exposure, FixedSite.Wall),
                        count: this.Wall.GetScoreCount(AreaAgingType.Exposure)
                    }
                ]
            }
        ]

        let count = 0
        
        for(let i=0; i < result.length; i++) {
            let avg = 0
            let _count = 0
            for(let j=0; j < result[i].agingData.length; j++) {
                if(avg < result[i].agingData[j].avg) {
                    avg = result[i].agingData[j].avg
                }

                _count += result[i].agingData[j].count
            }

            result[i].avg = avg
            result[i].count = _count
            count += _count
        }

        return {
            count: count,
            data: result
        }
    }
    CalcScoreAllObject(): object {
    let result = {
      [FixedSite.Slab]: {
        avg: 0,
        count: 0,
        agingData: {
          [AreaAgingType.Exfoliation]: {
            avg: this.Slab.CalcScore(AreaAgingType.Exfoliation, FixedSite.Slab),
            count: this.Slab.GetScoreCount(AreaAgingType.Exfoliation),
          },
          [AreaAgingType.Spalling]: {
            avg: this.Slab.CalcScore(AreaAgingType.Spalling, FixedSite.Slab),
            count: this.Slab.GetScoreCount(AreaAgingType.Spalling),
          },
          [AreaAgingType.Leak]: {
            avg: this.Slab.CalcScore(AreaAgingType.Leak, FixedSite.Slab),
            count: this.Slab.GetScoreCount(AreaAgingType.Leak),
          },
          [AreaAgingType.Exposure]: {
            avg: this.Slab.CalcScore(AreaAgingType.Exposure, FixedSite.Slab),
            count: this.Slab.GetScoreCount(AreaAgingType.Exposure),
          },
        },
      },
      [FixedSite.Beam]: {
        avg: 0,
        count: 0,
        agingData: {
          [AreaAgingType.Exfoliation]: {
            avg: this.Beam.CalcScore(AreaAgingType.Exfoliation, FixedSite.Beam),
            count: this.Beam.GetScoreCount(AreaAgingType.Exfoliation),
          },
          [AreaAgingType.Spalling]: {
            avg: this.Beam.CalcScore(AreaAgingType.Spalling, FixedSite.Beam),
            count: this.Beam.GetScoreCount(AreaAgingType.Spalling),
          },
          [AreaAgingType.Leak]: {
            avg: this.Beam.CalcScore(AreaAgingType.Leak, FixedSite.Beam),
            count: this.Beam.GetScoreCount(AreaAgingType.Leak),
          },
          [AreaAgingType.Exposure]: {
            avg: this.Beam.CalcScore(AreaAgingType.Exposure, FixedSite.Beam),
            count: this.Beam.GetScoreCount(AreaAgingType.Exposure),
          },
        },
      },
      [FixedSite.Girder]: {
        avg: 0,
        count: 0,
        agingData: {
          [AreaAgingType.Exfoliation]: {
            avg: this.Girder.CalcScore(AreaAgingType.Exfoliation, FixedSite.Girder),
            count: this.Girder.GetScoreCount(AreaAgingType.Exfoliation),
          },
          [AreaAgingType.Spalling]: {
            avg: this.Girder.CalcScore(AreaAgingType.Spalling, FixedSite.Girder),
            count: this.Girder.GetScoreCount(AreaAgingType.Spalling),
          },
          [AreaAgingType.Leak]: {
            avg: this.Girder.CalcScore(AreaAgingType.Leak, FixedSite.Girder),
            count: this.Girder.GetScoreCount(AreaAgingType.Leak),
          },
          [AreaAgingType.Exposure]: {
            avg: this.Girder.CalcScore(AreaAgingType.Exposure, FixedSite.Girder),
            count: this.Girder.GetScoreCount(AreaAgingType.Exposure),
          },
        },
      },
      [FixedSite.Column]: {
        avg: 0,
        count: 0,
        agingData: {
          [AreaAgingType.Exfoliation]: {
            avg: this.Column.CalcScore(AreaAgingType.Exfoliation, FixedSite.Column),
            count: this.Column.GetScoreCount(AreaAgingType.Exfoliation),
          },
          [AreaAgingType.Spalling]: {
            avg: this.Column.CalcScore(AreaAgingType.Spalling, FixedSite.Column),
            count: this.Column.GetScoreCount(AreaAgingType.Spalling),
          },
          [AreaAgingType.Leak]: {
            avg: this.Column.CalcScore(AreaAgingType.Leak, FixedSite.Column),
            count: this.Column.GetScoreCount(AreaAgingType.Leak),
          },
          [AreaAgingType.Exposure]: {
            avg: this.Column.CalcScore(AreaAgingType.Exposure, FixedSite.Column),
            count: this.Column.GetScoreCount(AreaAgingType.Exposure),
          },
        },
      },
      [FixedSite.Wall]: {
        avg: 0,
        count: 0,
        agingData: {
             [AreaAgingType.Exfoliation]: {
        avg: this.Wall.CalcScore(AreaAgingType.Exfoliation, FixedSite.Wall),
          count: this.Wall.GetScoreCount(AreaAgingType.Exfoliation),
              },
    [AreaAgingType.Spalling]:{
        avg: this.Wall.CalcScore(AreaAgingType.Spalling, FixedSite.Wall),
          count: this.Wall.GetScoreCount(AreaAgingType.Spalling),
              },
    [AreaAgingType.Leak]:{
        avg: this.Wall.CalcScore(AreaAgingType.Leak, FixedSite.Wall),
          count: this.Wall.GetScoreCount(AreaAgingType.Leak),
              },
    [AreaAgingType.Exposure]:{
        avg: this.Wall.CalcScore(AreaAgingType.Exposure, FixedSite.Wall),
          count: this.Wall.GetScoreCount(AreaAgingType.Exposure),
              },
  },
      },
  };

    let count = 0;
    for (let key in result) {
            let avg = 0;
      let _count = 0;
      for (let sub_key in result[key].agingData)
             {
              if (avg < result[key].agingData[sub_key].avg) {
                avg = result[key].agingData[sub_key].avg;
              }

              _count += result[key].agingData[sub_key].count;
            }

            result[key].avg = avg;
            result[key].count = _count;
            count += _count;
    }

    return {
      count: count,
      data: result,
    };
  }
}

export class InspectionTransformScore {
    public height : number
    public value : number
    public score : number
    public grade : grade

    constructor() {
        this.height = 0
        this.value = 0
        this.score = 0
        this.grade = grade.A
    }

    CalcGrade() {
        const matchA = 1/750
        const matchB = 1/500
        const matchC = 1/250
        const matchDE = 1/150

        if(this.value != 0) {
            this.score = this.height / this.value
        }

        if(this.score <= matchA) {
            this.grade = grade.A
        } else if(this.score <= matchB) {
            this.grade = grade.B
        } else if(this.score <= matchC) {
            this.grade = grade.C
        } else if(this.score <= matchDE) {
            this.grade = grade.D
        } else {
            this.grade = grade.E
        }
    }
}

export class InspectionFormula {
  public concreteStrength: InspectionScoreGroup;
  public concreteCarbonation: InspectionScoreGroup;
  public concreteCrack: InspectionArrayGroup;
  public areaAging: AreaAgingScoreGroup;
  public slope: InspectionTransformScore;
  public subsidence: InspectionTransformScore;

  constructor() {
    this.concreteStrength = new InspectionScoreGroup();
    this.concreteCarbonation = new InspectionScoreGroup();
    this.concreteCrack = new InspectionArrayGroup();
    this.areaAging = new AreaAgingScoreGroup();
    this.slope = new InspectionTransformScore();
    this.subsidence = new InspectionTransformScore();
  }

  Parser(data_array: Array<object>, schdmitMethod=SchdmitCalculateMethod.JAPAN_MATERIALS, highSchdmitMethod=HardSchdmitCalculateMethod.SCIENCE_TECH) {
    for (const data of data_array) {
      const values = data.values;

      if (data.type == DataTypes.SAFETYDIAGNOSIS_INSPECTION) {
        for (const error of values) {
          switch (error.type) {
            case safetyInspection.SchmidtValue:
              this.CalcConcreteStrength(error, schdmitMethod,highSchdmitMethod);
              break;
            case safetyInspection.CarbonationValue:
              this.CalcConcreteCarbonation(error);
              break;
            case safetyInspection.SlopeValue:
              this.CalcSlope(error);
              break;
            case safetyInspection.SubsidenceValue:
              this.CalcSubsidence(error);
              break;
          }
        }
      } else if (data.type == DataTypes.SAFETYDIAGNOSIS_APPEARENCE) {
        for (const error of values) {
          switch (error.type) {
            case appearenceInspection.CrackValue:
              this.CalcConcreteCrack(error);
              break;
            case appearenceInspection.AreaValue:
              this.CalcAreaAging(error);
              break;
          }
        }
      }
    }

    this.concreteStrength.CalcGrade();
    this.concreteCarbonation.CalcGrade();
  }

  toArray(): Array<object> {
    const makeSerialObject = (
      title: string,
      datatype: DataTypes.SAFETYDIAGNOSIS_APPEARENCE | DataTypes.SAFETYDIAGNOSIS_INSPECTION,
      type: appearenceInspection.CrackValue | appearenceInspection.AreaValue | safetyInspection.CarbonationValue | safetyInspection.RebarValue | safetyInspection.SchmidtValue
    ): object => {
      return {
        title: title,
        data: [
          { site: FixedSite.Slab, avg: 0, count: 0 },
          { site: FixedSite.Beam, avg: 0, count: 0 },
          { site: FixedSite.Column, avg: 0, count: 0 },
          { site: FixedSite.Girder, avg: 0, count: 0 },
          { site: FixedSite.Wall, avg: 0, count: 0 },
        ],
        dataType: datatype,
        type: type,
      };
    };

    let result: Array<object> = [
      makeSerialObject("콘크리트 강도", DataTypes.SAFETYDIAGNOSIS_INSPECTION, safetyInspection.SchmidtValue),
      makeSerialObject("콘크리트 중성화", DataTypes.SAFETYDIAGNOSIS_INSPECTION, safetyInspection.CarbonationValue),
      makeSerialObject("콘크리트 균열", DataTypes.SAFETYDIAGNOSIS_APPEARENCE, appearenceInspection.CrackValue),
      makeSerialObject("표면 노후", DataTypes.SAFETYDIAGNOSIS_APPEARENCE, appearenceInspection.AreaValue),
    ];

    const serializeScore = (_idx: number, source: InspectionScoreGroup) => {
      result[_idx].data[0].avg = source.Slab.getAvg();
      result[_idx].data[0].count = source.Slab.getCount();

      result[_idx].data[1].avg = source.Beam.getAvg();
      result[_idx].data[1].count = source.Beam.getCount();

      result[_idx].data[2].avg = source.Column.getAvg();
      result[_idx].data[2].count = source.Column.getCount();

      result[_idx].data[3].avg = source.Girder.getAvg();
      result[_idx].data[3].count = source.Girder.getCount();

      result[_idx].data[4].avg = source.Wall.getAvg();
      result[_idx].data[4].count = source.Wall.getCount();
    };

    serializeScore(0, this.concreteStrength);
    serializeScore(1, this.concreteCarbonation);

    // 콘크리트 균열 직렬화
    result[2].data[0].avg = this.concreteCrack.CalcScore(FixedSite.Slab);
    result[2].data[0].count = this.concreteCrack.GetCount(FixedSite.Slab);
    result[2].data[1].avg = this.concreteCrack.CalcScore(FixedSite.Beam);
    result[2].data[1].count = this.concreteCrack.GetCount(FixedSite.Beam);
    result[2].data[2].avg = this.concreteCrack.CalcScore(FixedSite.Column);
    result[2].data[2].count = this.concreteCrack.GetCount(FixedSite.Column);
    result[2].data[3].avg = this.concreteCrack.CalcScore(FixedSite.Girder);
    result[2].data[3].count = this.concreteCrack.GetCount(FixedSite.Girder);
    result[2].data[4].avg = this.concreteCrack.CalcScore(FixedSite.Wall);
    result[2].data[4].count = this.concreteCrack.GetCount(FixedSite.Wall);

    // 표면 노후 직렬화
    let areaAgingData = this.areaAging.CalcScoreAll();
    result[3] = { ...result[3], ...areaAgingData };

    // 기울기
    result.push({
      title: "기울기",
      datatype: DataTypes.SAFETYDIAGNOSIS_INSPECTION,
      type: safetyInspection.SlopeValue,
      data: {
        height: this.slope.score,
        value: this.slope.value,
        grade: this.slope.grade,
        score: this.slope.score,
      },
    });
    // 부동침하
    result.push({
      title: "부동침하",
      datatype: DataTypes.SAFETYDIAGNOSIS_INSPECTION,
      type: safetyInspection.SubsidenceValue,
      data: {
        height: this.subsidence.score,
        value: this.subsidence.value,
        grade: this.subsidence.grade,
        score: this.subsidence.score,
      },
    });

    return result;
    }

    toObject() {
        
        const makeSerialObject = (
            title: string,
            datatype: DataTypes.SAFETYDIAGNOSIS_APPEARENCE | DataTypes.SAFETYDIAGNOSIS_INSPECTION,
            type: appearenceInspection.CrackValue | appearenceInspection.AreaValue | safetyInspection.CarbonationValue | safetyInspection.RebarValue | safetyInspection.SchmidtValue
        ): object => {
            return {
                title: title,
                data: {
          [ FixedSite.Slab]:{ avg: 0, count: 0 },
           [FixedSite.Beam]:{ avg: 0, count: 0 },
            [FixedSite.Column] :{ avg: 0, count: 0 },
            [ FixedSite.Girder]: { avg: 0, count: 0 },
            [ FixedSite.Wall]: { avg: 0, count: 0 },
        },
        dataType: datatype,
        type: type,
      };
    };

    const result: any = {
        [safetyInspection.SchmidtValue] : makeSerialObject("콘크리트 강도", DataTypes.SAFETYDIAGNOSIS_INSPECTION, safetyInspection.SchmidtValue),
        [safetyInspection.CarbonationValue] : makeSerialObject("콘크리트 중성화", DataTypes.SAFETYDIAGNOSIS_INSPECTION, safetyInspection.CarbonationValue),
        [appearenceInspection.CrackValue] : makeSerialObject("콘크리트 균열", DataTypes.SAFETYDIAGNOSIS_APPEARENCE, appearenceInspection.CrackValue),
        [appearenceInspection.AreaValue] : makeSerialObject("표면 노후", DataTypes.SAFETYDIAGNOSIS_APPEARENCE, appearenceInspection.AreaValue),
    };

    const serializeScore = (key: safetyInspection.SchmidtValue | safetyInspection.CarbonationValue, source: InspectionScoreGroup) => {
      result[key].data[FixedSite.Slab].avg = source.Slab.getAvg();
      result[key].data[FixedSite.Slab].count = source.Slab.getCount();

      result[key].data[FixedSite.Beam].avg = source.Beam.getAvg();
      result[key].data[FixedSite.Beam].count = source.Beam.getCount();

      result[key].data[FixedSite.Column].avg = source.Column.getAvg();
      result[key].data[FixedSite.Column].count = source.Column.getCount();

      result[key].data[FixedSite.Girder].avg = source.Girder.getAvg();
      result[key].data[FixedSite.Girder].count = source.Girder.getCount();

      result[key].data[FixedSite.Wall].avg = source.Wall.getAvg();
      result[key].data[FixedSite.Wall].count = source.Wall.getCount();
    };

    serializeScore(safetyInspection.SchmidtValue, this.concreteStrength);
    serializeScore(safetyInspection.CarbonationValue, this.concreteCarbonation);

    // 콘크리트 균열 직렬화
    result[appearenceInspection.CrackValue].data[FixedSite.Slab].avg = this.concreteCrack.CalcScore(FixedSite.Slab);
    result[appearenceInspection.CrackValue].data[FixedSite.Slab].count = this.concreteCrack.GetCount(FixedSite.Slab);
    result[appearenceInspection.CrackValue].data[FixedSite.Beam].avg = this.concreteCrack.CalcScore(FixedSite.Beam);
    result[appearenceInspection.CrackValue].data[FixedSite.Beam].count = this.concreteCrack.GetCount(FixedSite.Beam);
    result[appearenceInspection.CrackValue].data[FixedSite.Column].avg = this.concreteCrack.CalcScore(FixedSite.Column);
    result[appearenceInspection.CrackValue].data[FixedSite.Column].count = this.concreteCrack.GetCount(FixedSite.Column);
    result[appearenceInspection.CrackValue].data[FixedSite.Girder].avg = this.concreteCrack.CalcScore(FixedSite.Girder);
    result[appearenceInspection.CrackValue].data[FixedSite.Girder].count = this.concreteCrack.GetCount(FixedSite.Girder);
    result[appearenceInspection.CrackValue].data[FixedSite.Wall].avg = this.concreteCrack.CalcScore(FixedSite.Wall);
    result[appearenceInspection.CrackValue].data[FixedSite.Wall].count = this.concreteCrack.GetCount(FixedSite.Wall);

    // 표면 노후 직렬화
    let areaAgingData = this.areaAging.CalcScoreAllObject();
    result[appearenceInspection.AreaValue] = { ...result[appearenceInspection.AreaValue], ...areaAgingData };

    // 기울기
    result[safetyInspection.SlopeValue] = {
      title: "기울기",
      datatype: DataTypes.SAFETYDIAGNOSIS_INSPECTION,
      type: safetyInspection.SlopeValue,
      data: {
        height: this.slope.score,
        value: this.slope.value,
        grade: this.slope.grade,
        score: this.slope.score,
      },
    };
    // 부동침하
    result[safetyInspection.SubsidenceValue] = {
      title: "부동침하",
      datatype: DataTypes.SAFETYDIAGNOSIS_INSPECTION,
      type: safetyInspection.SubsidenceValue,
      data: {
        height: this.subsidence.score,
        value: this.subsidence.value,
        grade: this.subsidence.grade,
        score: this.subsidence.score,
      },
    };

    return result;
    }


  CalcConcreteStrength(error: object, schdmitMethod : SchdmitCalculateMethod, highSchdmitMethod : HardSchdmitCalculateMethod): void {
    let sum = 0;

    for (const value of error.getValue()) {
      if (value == null) continue;
      sum += value;
    }

    let avg = error.getCalculateWithMethod(schdmitMethod);

    if(error.designedStrength >= 40) {
      avg = error.getCalculateWithHardMethod(highSchdmitMethod);
    }

    let percentage = 0;
    if (error.designedStrength != 0) percentage = avg / error.designedStrength;

    let score = 0;

    if (1 <= percentage) {
      if (error.cracked == false) score = 1; // A
      else score = 3; // B
    } else if (0.85 <= percentage && percentage < 1.0) {
      score = 5; // C
    } else if (0.7 <= percentage && percentage < 0.85) {
      score = 7; // D
    } else if (percentage < 0.7) {
      score = 9; // E
    }

    switch (error.site) {
      case FixedSite.Beam:
        this.concreteStrength.Beam.Score += score;
        this.concreteStrength.Beam.Count++;
        break;
      case FixedSite.Column:
        this.concreteStrength.Column.Score += score;
        this.concreteStrength.Column.Count++;
        break;
      case FixedSite.Girder:
        this.concreteStrength.Girder.Score += score;
        this.concreteStrength.Girder.Count++;
        break;
      case FixedSite.Slab:
        this.concreteStrength.Slab.Score += score;
        this.concreteStrength.Slab.Count++;
        break;
      case FixedSite.Wall:
        this.concreteStrength.Wall.Score += score;
        this.concreteStrength.Wall.Count++;
        break;
    }
  }

  CalcConcreteCarbonation(error: object): void {
    const depth = error.depth;
    const thickness = error.rebar.thickness;

    let thick075 = thickness * 0.75;
    let thick05 = thickness * 0.5;
    let thick025 = thickness * 0.25;

    let score = 0;

    if (depth <= thick025) score = 1; // A
    else if (thick025 < depth && depth <= thick05) score = 3; // B
    else if (thick05 < depth && depth <= thick075) score = 5; // C
    else if (thick075 < depth && depth <= thickness) score = 7; // D
    else score = 9;

    switch (error.site) {
      case FixedSite.Beam:
        this.concreteCarbonation.Beam.Score += score;
        this.concreteCarbonation.Beam.Count++;
        break;
      case FixedSite.Column:
        this.concreteCarbonation.Column.Score += score;
        this.concreteCarbonation.Column.Count++;
        break;
      case FixedSite.Girder:
        this.concreteCarbonation.Girder.Score += score;
        this.concreteCarbonation.Girder.Count++;
        break;
      case FixedSite.Slab:
        this.concreteCarbonation.Slab.Score += score;
        this.concreteCarbonation.Slab.Count++;
        break;
      case FixedSite.Wall:
        this.concreteCarbonation.Wall.Score += score;
        this.concreteCarbonation.Wall.Count++;
        break;
    }
  }

  CalcConcreteCrack(error: object): void {
    let v = 1;
    switch (error.grade) {
      case "E":
        v = 9;
        break;
      case "D":
        v = 7;
        break;
      case "C":
        v = 5;
        break;
      case "B":
        v = 3;
        break;
      case "A":
        v = 1;
        break;
    }

    for (let i = 0; i < parseInt(error.quantity); i++) {
      this.concreteCrack.AddScore(error.fixedSite, v);
      this.concreteCrack.AddAreaPercent(error.fixedSite, error.area);
    }
  }

  CalcAreaAging(error: object): void {
    let v = 1;
    switch (error.grade) {
      case "E":
        v = 9;
        break;
      case "D":
        v = 7;
        break;
      case "C":
        v = 5;
        break;
      case "B":
        v = 3;
        break;
      case "A":
        v = 1;
        break;
    }

    for (let i = 0; i < parseInt(error.quantity); i++) {
      this.areaAging.AddScore(error.value, error.fixedSite, v);
      this.areaAging.AddAreaPercent(error.value, error.fixedSite, error.area);
    }
  }

  CalcSlope(error: object): void {
    let newValue = new InspectionTransformScore();

    newValue.height = error.height;
    newValue.value = error.value;

    newValue.CalcGrade();

    if (this.slope.score < newValue.score) {
      this.slope = newValue;
    }
  }

  CalcSubsidence(error: object): void {
    let newValue = new InspectionTransformScore();

    newValue.height = error.height;
    newValue.value = error.value;

    newValue.CalcGrade();

    if (this.subsidence.score < newValue.score) {
      this.subsidence = newValue;
    }
  }
}

function MultiplyMat(m1 :Array<Array<number>>, m2 :Array<Array<number>>): Array<Array<number>> {
  let m = []

  for(let i=0; i < m1.length; i++) {
    let newRow = []
    for(let j=0; j < m1[i].length; j++) {
      newRow.push(0)
    }

    m.push(newRow)
  }

  for(let y=0; y < m.length; y++) {
    for(let x=0; x < m[y].length; x++) {
      let row = m1[y]
      let col = []
      
      for(let i=0; i < m2.length; i++) {
        col.push(m2[i][x])
      }

      for(let i=0; i < row.length; i++) {
        m[y][x] += row[i] * col[i]
      }
    }
  }

  return m
}

const CATable = [
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [0.75, 1, 0.5, 0.25, 0],
  [0.5, 0.75, 1, 0.5, 0]
]

const CLTable = [
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [0.75, 1, 0.25, 0, 0],
  [0.25, 0.75, 1, 0.75, 0],
  [0, 0.25, 0.75, 1, 0.75]
]

const DSTable = [
  [1, 0.06, 0.06, 0, 0],
  [1, 0.06, 0.06, 0, 0],
  [0.75, 0.25, 0.25, 0.25, 0.25],
  [0.75, 0.5, 0.5, 0.5, 0.5],
  [0.75, 0.5, 0.5, 0.5, 0.5]
]

const CRSTable = [
  [1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 0, 1]
]

const CRNTable = [
  [0.5, 0.06, 0, 0, 0],
  [0.5, 0.06, 0, 0, 0],
  [0.5, 0.25, 0.25, 0.25, 0.06],
  [0.5, 0.5, 0.25, 0.25, 0.06],
  [0.5, 0.5, 0.5, 0.5, 0.06]
]

const SDTable = [
  [0.5, 0.06, 0.06, 0, 0],
  [0.5, 0.06, 0.06, 0, 0],
  [0.5, 0.25, 0.25, 0.25, 0.06],
  [0.5, 0.5, 0.25, 0.25, 0.06],
  [0.5, 0.5, 0.5, 0.5 ,0.06]
]

const COTable = [
  [1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 0, 1]
]

const PriorityTable: { [key in FixedSite]: number } = {
  [FixedSite.Beam]: 0.5,
  [FixedSite.Column]: 0.9,
  [FixedSite.Girder]: 0.7,
  [FixedSite.Slab]: 0.3,
  [FixedSite.Wall]: 0.9,
};
function MembershipFunction(grade: string, value: number, result: Array<number>) : Array<number>{
  if(value < 0.75) return result

  let _result = [...result]

  const table = {
    A: [
      {s: 1.0, r: 0},
      {s: 1.0, r: 1},
      {s: 0.75, r: 2},
    ],
    B: [
      {s: 0.75, r: 2},
      {s: 1.0, r: 3},
      {s: 0.75, r: 4},
    ],
    C: [
      {s: 0.75, r: 4},
      {s: 1.0, r: 5},
      {s: 0.75, r: 4},
    ],
    D: [
      {s: 0.75, r: 6},
      {s: 1.0, r: 7},
      {s: 0.75, r: 8},
    ],
    E: [
      {s: 0.75, r: 8},
      {s: 1.0, r: 9},
      {s: 1.0, r: 10},
    ]
  }

  if(grade == 'A') {
    for(let i=0; i < table.A.length; i++) {
      if(table.A[i].s == value) {
        if(_result[table.A[i].r] < value) _result[table.A[i].r] = value
      }
    }
  } else if(grade == 'B') {
    for(let i=0; i < table.B.length; i++) {
      if(table.B[i].s == value) {
        if(_result[table.B[i].r] < value) _result[table.B[i].r] = value
      }
    }
  } else if(grade == 'C') {
    for(let i=0; i < table.B.length; i++) {
      if(table.C[i].s == value) {
        if(_result[table.C[i].r] < value) _result[table.C[i].r] = value
      }
    }
  } else if(grade == 'D') {
    for(let i=0; i < table.B.length; i++) {
      if(table.D[i].s == value) {
        if(_result[table.D[i].r] < value) _result[table.D[i].r] = value
      }
    }
  } else if(grade == 'E') {
    for(let i=0; i < table.B.length; i++) {
      if(table.E[i].s == value) {
        if(_result[table.E[i].r] < value) _result[table.E[i].r] = value
      }
    }
  }

  return _result
}

function ArrayLeague(arr: Array<number>, stack: number) : Array<Array<number>> {
  const res = [];
  const _arr = [...arr]
  if(stack === 1) return _arr.map((v) => [v]);

  arr.forEach((v, idx, _arr) => {
    const rest = _arr.slice(idx+1);
    const combinations = ArrayLeague(rest, stack-1);
    const attach = combinations.map((combination) => [v, ...combination]);
    res.push(...attach);
  })
  return res;
}

function CalcFuzzy(arr: Array<number>, score: number) : number {
  let _arr = [...arr]
  
  let _indices = []
  for(let i=0;i < _arr.length; i++) {
      _indices.push(i)
  }

  let result = 0

  for(let i=1; i <= _indices.length; i++) {
      let league = ArrayLeague(_indices, i)

      let aResult = 0
      for(let a=0; a < league.length; a++) {
          let r = _arr[league[a][0]]

          for(let b=1; b < league[a].length; b++) {
              r *= _arr[league[a][b]]
          }

          aResult += r
      }

      aResult *= Math.pow(score, i-1)
      result += aResult
  }

  return result
}

function GenerateMeasure(arr: Array<number>, decimal: number, current=1, last=0) : object {
  let v = 1/Math.pow(10,current-1)
  let d = 1/Math.pow(10,current)
  let max = last + v
  let min = last

  let results = []

  for(let i=min; i <= max; i+=d ) {
      let _i = Math.round(i*Math.pow(10,current))/Math.pow(10,current)
      if( _i >= 1) continue
      results.push({ i : _i, r : CalcFuzzy(arr, -_i)})
  }

  if(results.length == 0) return {i:-1, r: 0}
  
  results.sort((a,b) => Math.abs(1 - a.r) - Math.abs(1 - b.r))

  if(decimal != current) {
      let results2 = []

      for(let i=0 ; i < results.length; i++) {
          let m = GenerateMeasure(arr, decimal, current+1, results[i].i)
          if(m.i == -1) continue

          results2.push(m)
      }

      results2.sort((a,b) => Math.abs(1 - a.r) - Math.abs(1 - b.r))

      if(results2.length != 0) return results2[0]
      return {i: -1, r:0}
  }


  return {i : results[0].i, r : results[0].r }
}

const generateCombinations = (arr: number[], len: number): number[][] => {
  const results: number[][] = [];

  function backtrack(start: number, current: number[]): void {
      if (current.length === len) {
          results.push([...current]);
          return;
      }
      
      for (let i = start; i < arr.length; i++) {
          current.push(arr[i]);
          backtrack(i + 1, current);
          current.pop();
      }
  }

  backtrack(0, []);
  return results;
  }
  
  const productOfArray = (arr: number[]): number => {
  return arr.reduce((acc, val) => acc * val, 1);
}


export class InspectionGrade {
  public title: string
  public data: object
  public dataType: string
  public type: string
  
  constructor() {
    this.title = ''
    this.data = {}
    this.dataType = ''
    this.type = ''
  }
}

export class FloorScore {
  public floor: number
  public name: string
  public grades: Array<InspectionGrade>
  public score: number
  public priority: number
  public main_table: Array<object>

  constructor() {
    this.floor = 0
    this.name = ''
    this.grades = []
    this.score = 0
    this.priority = 0
    this.main_table = []
  }

  grade2column(grade: object) : Array<number> {
    if(grade.avg == 0) return [0,0,0,0,0]

    if(grade.avg > 7) {
      return [0,0,0,0,1]
    } else if(grade.avg > 5) {
      return [0,0,0,1,0]
    } else if(grade.avg > 3) {
      return [0,0,1,0,0]
    } else if(grade.avg > 1) {
      return [0,1,0,0,0] 
    } 
    
    return [1,0,0,0,0]
  }

  calcDurationTable(matSrc: Array<Array<number>>, site: FixedSite): Array<Array<number>> {
    const caM = MultiplyMat(matSrc, CATable)
    const clM = MultiplyMat(matSrc, CLTable)
    const dsM = MultiplyMat(matSrc, DSTable)
    let crM = MultiplyMat(matSrc, CRSTable)
    // if(site != FixedSite.Slab) {
    //   crM = MultiplyMat(matSrc, CRNTable)
    // }
    const sdM = MultiplyMat(matSrc, SDTable)
    const coM = MultiplyMat(matSrc, COTable)

    // const caM = MultiplyMat(matSrc, CRSTable)
    // const clM = MultiplyMat(matSrc, CRSTable)
    // const dsM = MultiplyMat(matSrc, CRSTable)
    // let crM = MultiplyMat(matSrc, CRSTable)
    // // if(site != FixedSite.Slab) {
    // //   crM = MultiplyMat(matSrc, CRNTable)
    // // }
    // const sdM = MultiplyMat(matSrc, CRSTable)
    // const coM = MultiplyMat(matSrc, CRSTable)

    let newMat = []

    newMat.push(caM[0])
    newMat.push(clM[1])
    newMat.push(dsM[2])
    newMat.push(crM[3])
    newMat.push(sdM[4])
    newMat.push(coM[5])

    let maxRow = []
    // 각 열별 맥스값 
    for(let x=0; x < newMat[0].length; x++) {
      let max = 0

      for(let y=0; y < newMat.length; y++) {
        if(max < newMat[y][x]) {
          max = newMat[y][x]
        }
      }

      maxRow.push(max)
    }
    
    newMat.push(maxRow)
    
    return newMat
  }

  calcScore() : object {
    let matSlab = []
    let matGirder = []
    let matBeam = []
    let matColumn = []
    let matWall = []

    // 순서를 지키기 위한 오브젝트화
    let obj = {}

    for(const grade of this.grades) {
      switch(grade.type) {
        case safetyInspection.SchmidtValue:
          obj.sd = grade.data
          break
        case safetyInspection.CarbonationValue:
          obj.ca = grade.data
          break
        case appearenceInspection.CrackValue:
          obj.cr = grade.data
          break
        case appearenceInspection.AreaValue:
          obj.ds = grade.data
          break
      }
    }

    matSlab.push(this.grade2column(obj.ca.s))
    matSlab.push([0,0,0,0,0])
    matSlab.push(this.grade2column(obj.ds.s))
    matSlab.push(this.grade2column(obj.cr.s))
    matSlab.push(this.grade2column(obj.sd.s))
    matSlab.push([0,0,0,0,0])

    matGirder.push(this.grade2column(obj.ca.g))
    matGirder.push([0,0,0,0,0])
    matGirder.push(this.grade2column(obj.ds.g))
    matGirder.push(this.grade2column(obj.cr.g))
    matGirder.push(this.grade2column(obj.sd.g))
    matGirder.push([0,0,0,0,0])

    matBeam.push(this.grade2column(obj.ca.b))
    matBeam.push([0,0,0,0,0])
    matBeam.push(this.grade2column(obj.ds.b))
    matBeam.push(this.grade2column(obj.cr.b))
    matBeam.push(this.grade2column(obj.sd.b))
    matBeam.push([0,0,0,0,0])

    matColumn.push(this.grade2column(obj.ca.c))
    matColumn.push([0,0,0,0,0])
    matColumn.push(this.grade2column(obj.ds.c))
    matColumn.push(this.grade2column(obj.cr.c))
    matColumn.push(this.grade2column(obj.sd.c))
    matColumn.push([0,0,0,0,0])

    matWall.push(this.grade2column(obj.ca.w))
    matWall.push([0,0,0,0,0])
    matWall.push(this.grade2column(obj.ds.w))
    matWall.push(this.grade2column(obj.cr.w))
    matWall.push(this.grade2column(obj.sd.w))
    matWall.push([0,0,0,0,0])

    let slab = this.calcDurationTable(matSlab, FixedSite.Slab)
    let girder = this.calcDurationTable(matGirder, FixedSite.Girder)
    let beam = this.calcDurationTable(matBeam, FixedSite.Beam)
    let column = this.calcDurationTable(matColumn, FixedSite.Column)
    let wall = this.calcDurationTable(matWall, FixedSite.Wall)

    const membershipFunc = (mat: Array<Array<number>>) : Array<number> => {
      let result = [0,0,0,0,0,0,0,0,0,0,0]
      result = MembershipFunction('A', mat[6][0], result)
      result = MembershipFunction('B', mat[6][1], result)
      result = MembershipFunction('C', mat[6][2], result)
      result = MembershipFunction('D', mat[6][3], result)
      result = MembershipFunction('E', mat[6][4], result)

      return result
    } 

    let slab_membership = membershipFunc(slab)
    let girder_membership = membershipFunc(girder)
    let beam_membership = membershipFunc(beam)
    let column_membership = membershipFunc(column)
    let wall_membership = membershipFunc(wall)

    // 대표값
    const extractMainValue = (table: Array<number>) : number => {
      let n = 0
      for(let x=0; x < table.length; x++) {
        if(table[x] >= 0.75) n = x
      }
      
      return n
    }

    let temp_main_table = [
      {t: FixedSite.Slab, p: PriorityTable[FixedSite.Slab], m: extractMainValue(slab_membership)},
      {t: FixedSite.Girder, p: PriorityTable[FixedSite.Girder], m: extractMainValue(girder_membership)},
      {t: FixedSite.Beam, p: PriorityTable[FixedSite.Beam], m: extractMainValue(beam_membership)},
      {t: FixedSite.Column, p: PriorityTable[FixedSite.Column], m: extractMainValue(column_membership)},
      {t: FixedSite.Wall, p: PriorityTable[FixedSite.Wall], m: extractMainValue(wall_membership)},
    ];

    let main_table = []
    for (let table_content of temp_main_table) {
      if (table_content.m != 0) {
        main_table.push(table_content);
      }
    }


    let _mt = [...main_table]
    main_table = []

    for(let i=0; i < _mt.length; i++) {
      main_table.push(_mt[i])
    }

    if(main_table.length == 0) return 0

    main_table.sort((a,b) => (a.m - b.m))

    let p_table = []
    for (let priority of main_table) {
        p_table.push(priority.p)
    }
    

    let measure = GenerateMeasure(p_table, 4)

    let result = 0
    for (let i = 0; i < main_table.length; i++) {
      let prevValue = main_table[i - 1] ? main_table[i - 1].m : 0
      let selfValue = main_table[i].m

      const splicedArray = main_table.map(item => item.p).splice(i, 1000);
      
      let lamda = 0;

      for (let j = 0; j < splicedArray.length; j++){
        let sum = 0;

        const combinations = generateCombinations(splicedArray, j + 1);
        
        for (let element of combinations) {
          sum = sum + productOfArray(element);
        }

        for (let z = 0; z < j; z++){
          sum = sum * measure.i * -1
        }

        lamda = lamda + sum
      }
      
      result += (selfValue - prevValue) * lamda;
    }

    let gradeValue = [..._mt]

    for(let i=0; i < gradeValue.length; i++) {
      const v = gradeValue[i].m
      if(v >= 8) gradeValue[i].m = 9
      else if(v >= 6) gradeValue[i].m = 7
      else if(v >= 4) gradeValue[i].m = 5
      else if(v >= 2) gradeValue[i].m = 3

      gradeValue[i].m = 1
    }

    this.score = result
    this.main_table = gradeValue
    return {
      score: result,
      main_table: gradeValue
    }
  }
}

export class BuildingInspection {
  public floorArray: Array<FloorScore>
  public score : number

  constructor() {
    this.floorArray = []
    this.score = 0
  }

  TotalParser(data: Array<object>) : number {
    let transformValue = 0
    let slopeValue = 0

    // 층별로 돌기
    for(const floor of data) {
      let newFloor = new FloorScore()

      newFloor.floor = floor.floor
      newFloor.name = floor.name

      // 기울기 부동침하 처리
      if( floor.data.sl != undefined ) {
        if( slopeValue < floor.data.sl.data.score ) {
          slopeValue = floor.data.sl.data.score
        }
      }

      if( floor.data.su != undefined ) {
        if( transformValue < floor.data.su.data.score ) {
          transformValue = floor.data.su.data.score
        }
      }
      
      for(const v of Object.values(floor.data)) {
        let newGrade = new InspectionGrade()
        newGrade.title = v.title
        newGrade.data = v.data
        newGrade.dataType = v.dataType
        newGrade.type = v.type

        newFloor.grades.push(newGrade)
      }

      this.floorArray.push(newFloor)

      const r = newFloor.calcScore()

      const floorinfo = floor.floorInfo
      let p = (floorinfo.total - ((floor.floor - floorinfo.underground + 1) - 1)) / floorinfo.total
      p = Math.ceil(p * 1000) / 1000

      if(p >= 0.8) newFloor.priority = 0.9
      else if(p >= 0.6) newFloor.priority = 0.7
      else if(p >= 0.4) newFloor.priority = 0.5
      else if(p >= 0.2) newFloor.priority = 0.3
      else if(p >= 0) newFloor.priority = 0.1
    }

    // let floorArray = [...this.floorArray]
    let floorArray = []

    for(let f of this.floorArray) {
      if(f.score != 0) floorArray.push(f)
    }

    floorArray.sort((a,b) => a.score - b.score)

    let inspectionResult = 0

    //추가됨

    let p_table = []

    for(let f of floorArray) p_table.push(f.priority)
    let measure = GenerateMeasure(p_table, 4)
    
    // score
    // priority
    for (let i = 0; i < floorArray.length; i++) {
      let prevValue = floorArray[i - 1] ? floorArray[i - 1].score : 0
      let selfValue = floorArray[i].score

      // 본인 포함한 모든 배열 가져오기
      const splicedArray = floorArray.map(floor => floor.priority).splice(i, 1000);
      
      // 개별 척도 만들기
      let lamda = 0;

      // 본인을 포함한 배열에서 2개 조합, 3개 조합... n개 조합을 만들기 위함
      for (let j = 0; j < splicedArray.length; j++){
        
        let sum = 0;

        // j+1개 만큼 배열 경우의수로 쪼개기
        const combinations = generateCombinations(splicedArray, j + 1);
        
        // 모든 배열 수 더하기
        for (let element of combinations) {
          sum = sum + productOfArray(element);
        }
        // 척도 제곱 구현
        for (let z = 0; z < j; z++){
          sum = sum * measure.i * -1
        }

        lamda = lamda + sum
      }

      inspectionResult += (selfValue - prevValue) * lamda;
    }

    let tsValue = Math.max(slopeValue, transformValue, 1)

    let sumArray = [
      // { p : 0.9, m : 0 },
      { p : 0.7, m : inspectionResult },
      { p : 0.7, m : tsValue }
    ]

    sumArray.sort((a,b) => (a.m - b.m))
    let p_table2 = []

    for(let s of sumArray) p_table2.push(s.p)
    let measure2 = GenerateMeasure(p_table2, 4)

    let result = 0
    for (let i = 0; i < sumArray.length; i++) {
      let prevValue = sumArray[i - 1] ? sumArray[i - 1].m : 0
      let selfValue = sumArray[i].m

      const splicedArray = sumArray.map(item => item.p).splice(i, 1000);
      
      let lamda = 0;

      for (let j = 0; j < splicedArray.length; j++){
        
        let sum = 0;

        const combinations = generateCombinations(splicedArray, j + 1);
        
        for (let element of combinations) {
          sum = sum + productOfArray(element);
        }

        for (let z = 0; z < j; z++){
          sum = sum * measure2.i * -1
        }

        lamda = lamda + sum
      }
      
      result += (selfValue - prevValue) * lamda;
    }

    this.score = result

    return {
      score: result,
      inspection_score: inspectionResult,
      tsValue: tsValue
    }
  }
}